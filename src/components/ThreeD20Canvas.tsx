import React, { useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

interface ThreeD20CanvasProps {
  size?: number;
  onRollComplete?: (result: number) => void;
  onRollStart?: () => void;
}

export interface ThreeD20Ref {
  roll: (targetNumber: number) => void;
}

const THREE_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      background: transparent;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #canvas-container {
      width: 100%;
      height: 100%;
      position: relative;
    }
    canvas {
      display: block;
      width: 100% !important;
      height: 100% !important;
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
<body>
  <div id="canvas-container"></div>

  <script>
    let scene, camera, renderer, dieMesh, wireframeMesh;
    let facePlanes = [];
    let particles;
    let isRolling = false;
    let rollStartTime = 0;
    const ROLL_DURATION = 2400; // ms
    let startQuat = new THREE.Quaternion();
    let targetQuat = new THREE.Quaternion();
    let spinVelocity = { x: 0.01, y: 0.015, z: 0.005 };

    const container = document.getElementById('canvas-container');
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    // 1. Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    // 2. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 2, 2.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // 3. Lighting (Baldur's Gate 3 Golden Arcane Atmosphere)
    const ambientLight = new THREE.AmbientLight(0xffeedd, 1.2);
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

    // Texture generator for numbers 1 to 20
    function createNumberTexture(num) {
      const cvs = document.createElement('canvas');
      cvs.width = 128;
      cvs.height = 128;
      const ctx = cvs.getContext('2d');

      ctx.clearRect(0, 0, 128, 128);

      // Gold text with shadow
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

    // Number assignment (standard D20 mapping where opposites sum to 21)
    const d20Numbers = [20, 1, 14, 7, 18, 3, 16, 5, 12, 9, 19, 2, 13, 8, 17, 4, 15, 6, 11, 10];
    const faceNormals = [];

    for (let f = 0; f < faceCount; f++) {
      const idx = f * 3;
      const vA = new THREE.Vector3().fromBufferAttribute(posAttr, idx);
      const vB = new THREE.Vector3().fromBufferAttribute(posAttr, idx + 1);
      const vC = new THREE.Vector3().fromBufferAttribute(posAttr, idx + 2);

      const center = new THREE.Vector3().add(vA).add(vB).add(vC).divideScalar(3);
      const normal = center.clone().normalize();
      faceNormals.push({ faceIndex: f, normal, number: d20Numbers[f % 20] });

      // Create number sprite on face
      const num = d20Numbers[f % 20];
      const tex = createNumberTexture(num);
      const numMat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
      });

      const numGeo = new THREE.PlaneGeometry(0.85, 0.85);
      const numMesh = new THREE.Mesh(numGeo, numMat);

      // Position slightly outside face
      numMesh.position.copy(normal.clone().multiplyScalar(radius * 1.03));
      // Align with normal
      numMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
      dieMesh.add(numMesh);
      facePlanes.push({ mesh: numMesh, number: num, normal });
    }

    // 6. Arcane Particles (Golden Stardust)
    const particleCount = 70;
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
    const f20 = faceNormals.find(f => f.number === 20);
    if (f20) {
      dieMesh.quaternion.setFromUnitVectors(f20.normal, new THREE.Vector3(0, 0, 1));
    }

    // 7. Roll Action Handler
    let targetResultNum = 20;

    window.triggerRoll = function(targetNum) {
      targetResultNum = targetNum || 20;
      isRolling = true;
      rollStartTime = performance.now();

      // Find face of target number
      const targetFace = faceNormals.find(f => f.number === targetResultNum) || faceNormals[0];
      
      // We want targetFace.normal to end pointing at Vector3(0, 0, 1) (camera)
      targetQuat.setFromUnitVectors(targetFace.normal, new THREE.Vector3(0, 0, 1));

      // Current quaternion
      startQuat.copy(dieMesh.quaternion);

      // Random high tumble velocity
      spinVelocity.x = (Math.random() > 0.5 ? 1 : -1) * (0.35 + Math.random() * 0.2);
      spinVelocity.y = (Math.random() > 0.5 ? 1 : -1) * (0.35 + Math.random() * 0.2);
      spinVelocity.z = (Math.random() > 0.5 ? 1 : -1) * (0.25 + Math.random() * 0.15);
    };

    // 8. Animation Loop
    function animate(time) {
      requestAnimationFrame(animate);

      // Floating gentle particle drift
      if (particles) {
        particles.rotation.y = time * 0.0003;
        particles.rotation.x = time * 0.00015;
      }

      if (isRolling) {
        const elapsed = time - rollStartTime;
        const progress = Math.min(1.0, elapsed / ROLL_DURATION);

        if (progress < 0.7) {
          // Wild tumble phase
          const speedFactor = 1.0 - (progress / 0.7) * 0.4;
          dieMesh.rotation.x += spinVelocity.x * speedFactor;
          dieMesh.rotation.y += spinVelocity.y * speedFactor;
          dieMesh.rotation.z += spinVelocity.z * speedFactor;

          // Scale pulse / bounce
          const bounce = Math.sin(progress * Math.PI * 3) * 0.15;
          dieMesh.scale.set(1 + bounce, 1 + bounce, 1 + bounce);
        } else {
          // Snap alignment phase (Cubic Slerp to target face)
          const alignProgress = (progress - 0.7) / 0.3;
          // Smooth ease out
          const ease = 1 - Math.pow(1 - alignProgress, 3);

          dieMesh.quaternion.slerp(targetQuat, ease * 0.25);
          dieMesh.scale.set(1.0, 1.0, 1.0);
        }

        if (progress >= 1.0) {
          isRolling = false;
          dieMesh.quaternion.copy(targetQuat);
          dieMesh.scale.set(1.0, 1.0, 1.0);

          // Notify React Native that roll completed!
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'ROLL_COMPLETE',
              number: targetResultNum,
            }));
          } else if (window.parent) {
            window.parent.postMessage(JSON.stringify({
              type: 'ROLL_COMPLETE',
              number: targetResultNum,
            }), '*');
          }
        }
      } else {
        // Idle floating
        dieMesh.position.y = Math.sin(time * 0.002) * 0.06;
      }

      renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);

    // Resize listener
    window.addEventListener('resize', () => {
      const newW = container.clientWidth || 300;
      const newH = container.clientHeight || 300;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    });

    // Listen for messages from React Native
    function handleMessage(event) {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data.type === 'ROLL') {
          window.triggerRoll(data.targetNumber);
        }
      } catch (e) {}
    }

    window.addEventListener('message', handleMessage);
    document.addEventListener('message', handleMessage);
  </script>
</body>
</html>
`;

export const ThreeD20Canvas = React.forwardRef<ThreeD20Ref, ThreeD20CanvasProps>(
  ({ size = 280, onRollComplete, onRollStart }, ref) => {
    const webViewRef = useRef<any>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const WebViewComp: any = WebView;

    React.useImperativeHandle(ref, () => ({
      roll: (targetNumber: number) => {
        if (onRollStart) onRollStart();

        const msg = JSON.stringify({ type: 'ROLL', targetNumber });
        if (Platform.OS === 'web') {
          if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(msg, '*');
          }
        } else {
          webViewRef.current?.postMessage(msg);
        }
      },
    }));

    const handleMessage = (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'ROLL_COMPLETE' && onRollComplete) {
          onRollComplete(data.number);
        }
      } catch (e) {
        // Ignore
      }
    };

    if (Platform.OS === 'web') {
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          {React.createElement('iframe', {
            ref: iframeRef,
            srcDoc: THREE_HTML,
            style: {
              width: '100%',
              height: '100%',
              border: 'none',
              background: 'transparent',
              pointerEvents: 'none',
            },
          })}
        </View>
      );
    }

    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <WebViewComp
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: THREE_HTML }}
          style={styles.webView}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          androidLayerType="hardware"
        />
      </View>
    );
  }
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
    width: '100%',
    height: '100%',
  },
});
