import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { BitcoinColors } from '@/constants/theme';
import { THREE_JS_SOURCE } from '@/constants/threeSource';

export type ThreeD20Status = 'loading' | 'ready' | 'failed';

interface ThreeD20CanvasProps {
  size?: number;
  onRollComplete?: (result: number) => void;
  onRollStart?: () => void;
  onStatusChange?: (status: ThreeD20Status, reason: string) => void;
}

export interface ThreeD20Ref {
  roll: (targetNumber: number) => void;
}

// Se o WebView não confirmar o primeiro frame renderizado, assumimos falha e
// mostramos o motivo em vez de deixar a área do dado em branco.
const READY_TIMEOUT_MS = 6000;

const buildHtml = () => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      background: transparent !important;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #canvas-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    canvas {
      display: block;
      background: transparent !important;
    }
  </style>
  <script>
    // Instalado ANTES do bundle do Three.js: sem isso, um erro dentro do
    // bundle não seria reportado a ninguém e a tela ficaria apenas em branco.
    window.notifyRN = function (payload) {
      try {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify(payload));
        } else if (window.parent && window.parent !== window) {
          window.parent.postMessage(JSON.stringify(payload), '*');
        }
      } catch (e) {
        // WebView ainda sem ponte de mensagens: nada a fazer aqui.
      }
    };

    window.onerror = function (msg, url, line) {
      window.notifyRN({ type: 'ERROR', message: 'JS: ' + msg + ' (linha ' + line + ')' });
      return false;
    };

    window.addEventListener('unhandledrejection', function (event) {
      var reason = event && event.reason && event.reason.message ? event.reason.message : String(event && event.reason);
      window.notifyRN({ type: 'ERROR', message: 'Promise: ' + reason });
    });
  </script>
  <script>
    ${THREE_JS_SOURCE}
  </script>
</head>
<body>
  <div id="canvas-container"></div>

  <script>
    let scene, camera, renderer, dieMesh, wireframeMesh;
    let particles;
    let isRolling = false;
    let rollStartTime = 0;
    const ROLL_DURATION = 2400; // ms
    let startQuat, targetQuat;
    let spinVelocity = { x: 0.01, y: 0.015, z: 0.005 };

    const container = document.getElementById('canvas-container');
    let width = window.innerWidth || 280;
    let height = window.innerHeight || 280;
    if (width < 50) width = 280;
    if (height < 50) height = 280;

    // 0. Sonde de WebGL explícita. O Android WebView tem um numero limitado de
    // contextos e falha de formas diferentes por dispositivo, entao detectamos
    // e reportamos em vez de deixar o THREE.WebGLRenderer morrer em silencio.
    let webglMode = 'none';
    let probeCanvas = null;
    let probeCtx = null;
    try {
      const probeOpts = {
        alpha: true,
        antialias: false,
        depth: true,
        stencil: false,
        failIfMajorPerformanceCaveat: false,
      };
      probeCanvas = document.createElement('canvas');
      probeCtx = probeCanvas.getContext('webgl2', probeOpts);
      if (probeCtx) {
        webglMode = 'webgl2';
      } else {
        probeCtx = probeCanvas.getContext('webgl', probeOpts) || probeCanvas.getContext('experimental-webgl', probeOpts);
        if (probeCtx) webglMode = 'webgl1';
      }
    } catch (probeErr) {
      webglMode = 'none';
      probeCtx = null;
    }

    // 1. Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    startQuat = new THREE.Quaternion();
    targetQuat = new THREE.Quaternion();

    // 2. Renderer em estagios. preserveDrawingBuffer e necessario em varios
    // Android WebView com camada de hardware + fundo transparente, onde o
    // canvas WebGL e desenhado mas nunca composto (tela em branco).
    const rendererAttempts = [
      { antialias: true, alpha: true, preserveDrawingBuffer: true },
      { antialias: false, alpha: true, preserveDrawingBuffer: true },
      { canvas: probeCanvas, context: probeCtx },
    ];

    let lastRendererError = null;
    for (let ri = 0; ri < rendererAttempts.length; ri++) {
      if (ri === 2 && !probeCtx) continue;
      try {
        renderer = new THREE.WebGLRenderer(rendererAttempts[ri]);
        break;
      } catch (err) {
        lastRendererError = err;
        renderer = null;
      }
    }

    if (!renderer) {
      window.notifyRN({
        type: 'WEBGL_UNAVAILABLE',
        message:
          'Falha ao criar o WebGLRenderer (' +
          (lastRendererError && lastRendererError.message ? lastRendererError.message : 'motivo desconhecido') +
          ') | sonda: ' + webglMode,
      });
    } else {
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 2, 2.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.setClearColor(0x000000, 0); // 100% transparente
      container.appendChild(renderer.domElement);

      renderer.domElement.addEventListener(
        'webglcontextlost',
        function () {
          window.notifyRN({ type: 'ERROR', message: 'Contexto WebGL perdido (webglcontextlost).' });
        },
        false,
      );
    }

    // 3. Lighting (Baldur's Gate 3 Golden Arcane Atmosphere)
    const ambientLight = new THREE.AmbientLight(0xffeedd, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffd700, 2.2);
    dirLight1.position.set(4, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf7931a, 1.8);
    dirLight2.position.set(-4, -2, 2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xa855f7, 2.0, 10);
    pointLight.position.set(0, 0, 2.5);
    scene.add(pointLight);

    // 4. Create D20 Icosahedron Geometry
    const radius = 1.45;
    const geometry = new THREE.IcosahedronGeometry(radius, 0);

    // Material: Dark obsidian metal with gold reflections
    const material = new THREE.MeshStandardMaterial({
      color: 0x141824,
      roughness: 0.25,
      metalness: 0.88,
      flatShading: true,
    });

    dieMesh = new THREE.Mesh(geometry, material);
    scene.add(dieMesh);

    // Gold Beveled Wireframe
    const wireGeo = new THREE.WireframeGeometry(geometry);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xffb800,
      linewidth: 2,
      transparent: true,
      opacity: 0.75,
    });
    wireframeMesh = new THREE.LineSegments(wireGeo, wireMat);
    dieMesh.add(wireframeMesh);

    // 5. Extract Face Centers and Normals to attach 3D Face Numbers
    const posAttr = geometry.attributes.position;
    const faceCount = posAttr.count / 3; // 20 faces

    function createNumberTexture(num) {
      const cvs = document.createElement('canvas');
      cvs.width = 128;
      cvs.height = 128;
      const ctx = cvs.getContext('2d');

      ctx.clearRect(0, 0, 128, 128);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold ' + (num === 20 || num === 1 ? '58px' : '52px') + ' system-ui, sans-serif';

      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      if (num === 20) {
        ctx.fillStyle = '#FFD700';
      } else if (num === 1) {
        ctx.fillStyle = '#EF4444';
      } else {
        ctx.fillStyle = '#FFFFFF';
      }

      ctx.fillText(String(num), 64, 64);

      const tex = new THREE.CanvasTexture(cvs);
      tex.needsUpdate = true;
      return tex;
    }

    const d20Numbers = [20, 1, 14, 7, 18, 3, 16, 5, 12, 9, 19, 2, 13, 8, 17, 4, 15, 6, 11, 10];
    const faceNormals = [];

    for (let f = 0; f < faceCount; f++) {
      const idx = f * 3;
      const vA = new THREE.Vector3().fromBufferAttribute(posAttr, idx);
      const vB = new THREE.Vector3().fromBufferAttribute(posAttr, idx + 1);
      const vC = new THREE.Vector3().fromBufferAttribute(posAttr, idx + 2);

      const center = new THREE.Vector3().add(vA).add(vB).add(vC).divideScalar(3);
      const normal = center.clone().normalize();
      faceNormals.push({ faceIndex: f, normal: normal, number: d20Numbers[f % 20] });

      const num = d20Numbers[f % 20];
      const tex = createNumberTexture(num);
      const numMat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
      });

      const numGeo = new THREE.PlaneGeometry(0.85, 0.85);
      const numMesh = new THREE.Mesh(numGeo, numMat);

      numMesh.position.copy(normal.clone().multiplyScalar(radius * 1.03));
      numMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      dieMesh.add(numMesh);
    }

    // 6. Arcane Particles (Golden Stardust)
    const particleCount = 60;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const pR = 2.0 + Math.random() * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pPositions[i] = pR * Math.sin(phi) * Math.cos(theta);
      pPositions[i + 1] = pR * Math.sin(phi) * Math.sin(theta);
      pPositions[i + 2] = pR * Math.cos(phi);
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
    });
    particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Initial orientation: face 20 pointing at camera
    const f20 = faceNormals.find(function (f) {
      return f.number === 20;
    });
    if (f20) {
      dieMesh.quaternion.setFromUnitVectors(f20.normal, new THREE.Vector3(0, 0, 1));
    }

    // 7. Roll Action Handler
    let targetResultNum = 20;

    window.triggerRoll = function (targetNum) {
      targetResultNum = targetNum || 20;
      isRolling = true;
      rollStartTime = performance.now();

      const targetFace = faceNormals.find(function (f) {
        return f.number === targetResultNum;
      }) || faceNormals[0];
      targetQuat.setFromUnitVectors(targetFace.normal, new THREE.Vector3(0, 0, 1));
      startQuat.copy(dieMesh.quaternion);

      spinVelocity.x = (Math.random() > 0.5 ? 1 : -1) * (0.35 + Math.random() * 0.2);
      spinVelocity.y = (Math.random() > 0.5 ? 1 : -1) * (0.35 + Math.random() * 0.2);
      spinVelocity.z = (Math.random() > 0.5 ? 1 : -1) * (0.25 + Math.random() * 0.15);
    };

    // 8. Animation Loop
    let renderOkFrames = 0;
    let renderFailFrames = 0;

    function animate(time) {
      requestAnimationFrame(animate);

      // Sem renderer ou sem malha nao ha nada para desenhar: saímos sem lancar
      // excecao a cada frame (o timeout do lado RN trata de avisar o usuario).
      if (!renderer || !dieMesh) return;

      if (particles) {
        particles.rotation.y = time * 0.0003;
        particles.rotation.x = time * 0.00015;
      }

      if (isRolling) {
        const elapsed = time - rollStartTime;
        const progress = Math.min(1.0, elapsed / ROLL_DURATION);

        if (progress < 0.7) {
          const speedFactor = 1.0 - (progress / 0.7) * 0.4;
          dieMesh.rotation.x += spinVelocity.x * speedFactor;
          dieMesh.rotation.y += spinVelocity.y * speedFactor;
          dieMesh.rotation.z += spinVelocity.z * speedFactor;

          const bounce = Math.sin(progress * Math.PI * 3) * 0.15;
          dieMesh.scale.set(1 + bounce, 1 + bounce, 1 + bounce);
        } else {
          const alignProgress = (progress - 0.7) / 0.3;
          const ease = 1 - Math.pow(1 - alignProgress, 3);

          dieMesh.quaternion.slerp(targetQuat, ease * 0.25);
          dieMesh.scale.set(1.0, 1.0, 1.0);
        }

        if (progress >= 1.0) {
          isRolling = false;
          dieMesh.quaternion.copy(targetQuat);
          dieMesh.scale.set(1.0, 1.0, 1.0);

          window.notifyRN({ type: 'ROLL_COMPLETE', number: targetResultNum });
        }
      } else {
        dieMesh.position.y = Math.sin(time * 0.002) * 0.06;
      }

      try {
        renderer.render(scene, camera);
        renderOkFrames++;
        if (renderOkFrames === 1) {
          // READY so depois do PRIMEIRO FRAME de verdade, nao depois que o
          // script terminou de rodar: script ok + frame nunca desenhado era
          // exatamente o cenario do dado invisivel.
          window.notifyRN({ type: 'READY', message: 'primeiro frame renderizado' });
        }
      } catch (renderErr) {
        renderFailFrames++;
        if (renderFailFrames === 1 || renderFailFrames === 60) {
          window.notifyRN({
            type: 'ERROR',
            message: 'render(): ' + (renderErr && renderErr.message ? renderErr.message : String(renderErr)),
          });
        }
      }
    }

    requestAnimationFrame(animate);

    function resizeCanvas() {
      const w = window.innerWidth || container.clientWidth || 280;
      const h = window.innerHeight || container.clientHeight || 280;
      if (w > 50 && h > 50 && renderer && camera) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    }

    window.addEventListener('resize', resizeCanvas);
    setTimeout(resizeCanvas, 100);
    setTimeout(resizeCanvas, 500);

    function handleMessage(event) {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && data.type === 'ROLL') {
          window.triggerRoll(data.targetNumber);
        }
      } catch (e) {
        // Mensagem que nao vem de nos (ex. bridge do proprio WebView).
      }
    }

    window.addEventListener('message', handleMessage);
    document.addEventListener('message', handleMessage);

    // O script parseou. Isso NAO significa que o 3D esta visivel — por isso o
    // lado RN espera o READY do primeiro frame, e nao este evento.
    window.notifyRN({ type: 'LOADED', message: 'script three.js carregado' });
  </script>
</body>
</html>
`;

export const ThreeD20Canvas = React.forwardRef<ThreeD20Ref, ThreeD20CanvasProps>(
  function ThreeD20Canvas({ size = 280, onRollComplete, onRollStart, onStatusChange }, ref) {
    const webViewRef = useRef<any>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const WebViewComp: any = WebView;

    const [dice, setDice] = useState<{ status: ThreeD20Status; reason: string }>({
      status: 'loading',
      reason: '',
    });

    const statusRef = useRef<ThreeD20Status>('loading');
    const pendingRollRef = useRef<number | null>(null);
    const onStatusChangeRef = useRef(onStatusChange);

    useEffect(() => {
      onStatusChangeRef.current = onStatusChange;
    }, [onStatusChange]);

    useEffect(() => {
      statusRef.current = dice.status;
      onStatusChangeRef.current?.(dice.status, dice.reason);
    }, [dice]);

    const htmlContent = React.useMemo(() => buildHtml(), []);

    const sendRoll = useCallback((targetNumber: number) => {
      const msg = JSON.stringify({ type: 'ROLL', targetNumber });
      if (Platform.OS === 'web') {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(msg, '*');
        }
      } else {
        webViewRef.current?.postMessage(msg);
      }
    }, []);

    const markReady = useCallback(() => {
      setDice(prev => (prev.status === 'ready' ? prev : { status: 'ready', reason: '' }));
    }, []);

    const markFailed = useCallback((reason: string) => {
      setDice(prev => (prev.status === 'failed' && prev.reason === reason ? prev : { status: 'failed', reason }));
    }, []);

    const dispatchPayload = useCallback(
      (payload: any) => {
        if (!payload || typeof payload.type !== 'string') return;

        switch (payload.type) {
          case 'READY': {
            markReady();
            // Rolagem pedida antes do 3D estar pronto nao e mais descartada.
            if (pendingRollRef.current !== null) {
              const queued = pendingRollRef.current;
              pendingRollRef.current = null;
              sendRoll(queued);
            }
            break;
          }
          case 'ERROR':
          case 'WEBGL_UNAVAILABLE':
            markFailed(String(payload.message || 'erro desconhecido no 3D'));
            break;
          case 'ROLL_COMPLETE':
            if (onRollComplete) onRollComplete(payload.number);
            break;
          default:
            // LOADED não muda nada visível: o READY do primeiro frame é o que vale.
            break;
        }
      },
      [markFailed, markReady, onRollComplete, sendRoll],
    );

    const dispatchRef = useRef(dispatchPayload);
    useEffect(() => {
      dispatchRef.current = dispatchPayload;
    }, [dispatchPayload]);

    React.useImperativeHandle(ref, () => ({
      roll: (targetNumber: number) => {
        if (onRollStart) onRollStart();

        if (statusRef.current === 'loading') {
          pendingRollRef.current = targetNumber;
          return;
        }

        // 'ready' envia na hora; 'failed' tenta mesmo assim para nao travar a
        // rolagem (o resultado ja esta calculado no GameContext).
        sendRoll(targetNumber);
      },
    }));

    useEffect(() => {
      const timer = setTimeout(() => {
        if (statusRef.current === 'loading') {
          markFailed('o WebView não confirmou a renderização 3D em ' + READY_TIMEOUT_MS / 1000 + 's');
        }
      }, READY_TIMEOUT_MS);
      return () => clearTimeout(timer);
    }, [markFailed]);

    // Na web o iframe nao tem ponte de mensagens do RN: usamos postMessage.
    useEffect(() => {
      if (Platform.OS !== 'web') return;

      const listener = (event: MessageEvent) => {
        if (typeof event.data !== 'string') return;
        try {
          dispatchRef.current(JSON.parse(event.data));
        } catch {
          // Mensagem de outra origem, nao nos interessa.
        }
      };

      window.addEventListener('message', listener);
      return () => window.removeEventListener('message', listener);
    }, []);

    const handleWebViewMessage = (event: any) => {
      try {
        dispatchPayload(JSON.parse(event.nativeEvent.data));
      } catch {
        // Payload malformado: ignorar.
      }
    };

    const failedOverlay =
      dice.status === 'failed' ? (
        <View style={styles.failOverlay} pointerEvents="none">
          <MaterialCommunityIcons name="alert-circle-outline" size={28} color={BitcoinColors.textMuted} />
          <Text style={styles.failTitle}>3D indisponível</Text>
          <Text style={styles.failReason} numberOfLines={4}>
            {dice.reason}
          </Text>
        </View>
      ) : null;

    // Barra de diagnóstico removida: o problema de renderização era a largura
    // 0px do WebView, já corrigida. Fica só o overlay de falha.

    if (Platform.OS === 'web') {
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          {React.createElement('iframe', {
            ref: iframeRef,
            srcDoc: htmlContent,
            style: {
              width: '100%',
              height: '100%',
              border: 'none',
              background: 'transparent',
              pointerEvents: 'none',
            },
          })}
          {failedOverlay}
        </View>
      );
    }

    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <WebViewComp
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: htmlContent, baseUrl: 'https://localhost' }}
          style={[styles.webView, { width: size, height: size }]}
          onMessage={handleWebViewMessage}
          onErrorSynthetic={(e: any) =>
            markFailed('erro de carregamento: ' + (e?.nativeEvent?.description || e?.nativeEvent?.error || 'desconhecido'))
          }
          onError={(e: any) => markFailed('falha de rede: ' + (e?.nativeEvent?.description || 'desconhecido'))}
          onHttpError={(e: any) => markFailed('HTTP ' + (e?.nativeEvent?.statusCode ?? 'erro'))}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          allowFileAccess={true}
          mixedContentMode="always"
          overScrollMode="never"
          androidLayerType="hardware"
        />
        {failedOverlay}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  webView: {
    backgroundColor: 'transparent',
    // Tamanho em PIXEL é obrigatório aqui: com width/height '100%' o WebView
    // do Android mediu 0 de largura (onLayout 0x290), o canvas ficava
    // centralizado num container de 0px e o overflow:hidden cortava tudo.
  },
  failOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 6,
  },
  failTitle: {
    color: BitcoinColors.textSecondary,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  failReason: {
    color: BitcoinColors.textMuted,
    fontSize: 11,
    lineHeight: 15,
    textAlign: 'center',
  },
});
