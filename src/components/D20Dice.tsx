import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGame, triggerHaptic } from '@/context/GameContext';
import { BitcoinColors } from '@/constants/theme';
import { D20Result } from '@/types';
import { ThreeD20Canvas, ThreeD20Ref, ThreeD20Status } from './ThreeD20Canvas';

const { width } = Dimensions.get('window');
const DIE_SIZE = Math.min(width - 48, 290);

export const D20Dice: React.FC = () => {
  const { userState, rollD20 } = useGame();
  const router = useRouter();

  const canvasRef = useRef<ThreeD20Ref>(null);

  const [isRolling, setIsRolling] = useState(false);
  const [currentResult, setCurrentResult] = useState<D20Result | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // O WebView do 3D demora a carregar o bundle do Three.js. Rolar antes disso
  // era perdido silenciosamente, então liberamos o botão somente quando o
  // primeiro frame for confirmado ('ready') ou quando o 3D falhar.
  const [diceStatus, setDiceStatus] = useState<ThreeD20Status>('loading');
  const diceLoading = diceStatus === 'loading';

  const handleRoll = async () => {
    if (isRolling || userState.diceRollsAvailable <= 0) return;

    try {
      setIsRolling(true);
      triggerHaptic('heavy');

      // 1. Calculate roll result in game context
      const result = await rollD20();
      setCurrentResult(result);

      // 2. Trigger real 3D WebGL roll animation!
      canvasRef.current?.roll(result.baseRoll);

      // Fallback timer in case webview message drops (safety timeout)
      const safetyTimer = setTimeout(() => {
        handleRollFinished(result);
      }, 3000);

      (handleRoll as any).safetyTimer = safetyTimer;
    } catch (err: any) {
      setIsRolling(false);
      console.warn('Erro ao rolar D20:', err.message);
    }
  };

  const handleRollFinished = (result: D20Result) => {
    if ((handleRoll as any).safetyTimer) {
      clearTimeout((handleRoll as any).safetyTimer);
    }

    setIsRolling(false);

    if (result.baseRoll === 20) {
      triggerHaptic('success');
    } else if (result.baseRoll === 1) {
      triggerHaptic('warning');
    } else {
      triggerHaptic('success');
    }

    setTimeout(() => {
      setModalVisible(true);
    }, 400);
  };

  const handleCanvasRollComplete = (faceNumber: number) => {
    if (currentResult) {
      handleRollFinished(currentResult);
    }
  };

  return (
    <View style={styles.container}>
      {/* Rolls Counter Badge */}
      <View style={styles.rollsCounterCard}>
        <MaterialCommunityIcons name="dice-d20" size={20} color="#FFD700" />
        <Text style={styles.rollsCounterText}>
          {userState.diceRollsAvailable > 0
            ? `Você possui ${userState.diceRollsAvailable} rolagem${userState.diceRollsAvailable > 1 ? 'ns' : ''} de D20!`
            : 'Conclua lições para ganhar novas rolagens do D20!'}
        </Text>
      </View>

      {/* Baldur's Gate 3 3D WebGL Arena */}
      <View style={styles.arenaContainer}>
        {/* Arcane Rune Ring */}
        <View style={styles.runeRing}>
          <View style={styles.runeDotTop} />
          <View style={styles.runeDotBottom} />
          <View style={styles.runeDotLeft} />
          <View style={styles.runeDotRight} />
        </View>

        {/* Real 3D WebGL Three.js D20 Canvas */}
        <View style={styles.canvasContainer}>
          <ThreeD20Canvas
            ref={canvasRef}
            size={DIE_SIZE}
            onRollComplete={handleCanvasRollComplete}
            onStatusChange={setDiceStatus}
          />
        </View>

        {/* Dynamic 3D Tag */}
        <View style={styles.threeDTag}>
          <Text style={styles.threeDTagText}>3D REAL • THREE.JS</Text>
        </View>
      </View>

      {/* Roll Action Button */}
      <TouchableOpacity
        style={[
          styles.rollButton,
          (userState.diceRollsAvailable <= 0 || isRolling || diceLoading) && styles.rollButtonDisabled,
        ]}
        onPress={handleRoll}
        disabled={userState.diceRollsAvailable <= 0 || isRolling || diceLoading}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons
          name={isRolling ? 'dice-d20-outline' : 'dice-d20'}
          size={24}
          color={diceLoading ? BitcoinColors.textSecondary : '#000000'}
        />
        <Text
          style={[
            styles.rollButtonText,
            (diceLoading || isRolling || userState.diceRollsAvailable <= 0) && styles.rollButtonTextDisabled,
          ]}
        >
          {diceLoading
            ? 'CARREGANDO 3D...'
            : isRolling
            ? 'ROLANDO D20 EM 3D...'
            : userState.diceRollsAvailable > 0
            ? 'ROLAR DADO D20'
            : 'SEM ROLAGENS DISPONÍVEIS'}
        </Text>
      </TouchableOpacity>

      {/* D&D Tiers Breakdown Guide */}
      <View style={styles.tierGuideCard}>
        <Text style={styles.tierGuideTitle}>Tabela de Recompensas D&D</Text>
        <View style={styles.tierList}>
          <View style={styles.tierItem}>
            <View style={[styles.tierTag, { backgroundColor: 'rgba(255, 184, 0, 0.2)' }]}>
              <Text style={[styles.tierTagText, { color: '#FFB800' }]}>20 Natural</Text>
            </View>
            <Text style={styles.tierLabel}>Sucesso Crítico Lendário</Text>
            <Text style={styles.tierSats}>1.000 sats</Text>
          </View>

          <View style={styles.tierItem}>
            <View style={[styles.tierTag, { backgroundColor: 'rgba(168, 85, 247, 0.2)' }]}>
              <Text style={[styles.tierTagText, { color: '#A855F7' }]}>Total 18+</Text>
            </View>
            <Text style={styles.tierLabel}>Sucesso Superior</Text>
            <Text style={styles.tierSats}>210 sats</Text>
          </View>

          <View style={styles.tierItem}>
            <View style={[styles.tierTag, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
              <Text style={[styles.tierTagText, { color: '#3B82F6' }]}>Total 12-17</Text>
            </View>
            <Text style={styles.tierLabel}>Sucesso Sólido</Text>
            <Text style={styles.tierSats}>100 sats</Text>
          </View>

          <View style={styles.tierItem}>
            <View style={[styles.tierTag, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
              <Text style={[styles.tierTagText, { color: '#10B981' }]}>Total 2-11</Text>
            </View>
            <Text style={styles.tierLabel}>Sucesso Básico</Text>
            <Text style={styles.tierSats}>50 sats</Text>
          </View>

          <View style={styles.tierItem}>
            <View style={[styles.tierTag, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
              <Text style={[styles.tierTagText, { color: '#EF4444' }]}>1 Natural</Text>
            </View>
            <Text style={styles.tierLabel}>Falha Crítica (Consolação)</Text>
            <Text style={styles.tierSats}>21 sats</Text>
          </View>
        </View>
      </View>

      {/* Baldur's Gate 3 Style Result Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.bg3ModalContent}>
            {/* Header Crest */}
            <View
              style={[
                styles.crestCircle,
                currentResult?.baseRoll === 20 && styles.crestCircleCrit,
              ]}
            >
              <MaterialCommunityIcons
                name="dice-d20"
                size={40}
                color={currentResult?.baseRoll === 20 ? '#FFD700' : BitcoinColors.bitcoin}
              />
            </View>

            <Text style={styles.modalTierTitle}>{currentResult?.tierTitle}</Text>
            <Text style={styles.modalTierDesc}>{currentResult?.tierDescription}</Text>

            {/* Breakdown Box */}
            <View style={styles.calcBox}>
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Rolagem no D20 3D:</Text>
                <Text style={styles.calcValueBold}>{currentResult?.baseRoll}</Text>
              </View>

              {currentResult && currentResult.modifier > 0 && (
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>+ Bônus de Proficiência:</Text>
                  <Text style={styles.calcBonus}>+{currentResult.modifier}</Text>
                </View>
              )}

              <View style={styles.calcDivider} />

              <View style={styles.calcRow}>
                <Text style={styles.calcTotalLabel}>Resultado Final:</Text>
                <Text style={styles.calcTotalValue}>{currentResult?.total}</Text>
              </View>
            </View>

            {/* Satoshis Won Banner */}
            <View style={styles.satRewardBanner}>
              <Ionicons name="logo-bitcoin" size={26} color={BitcoinColors.bitcoin} />
              <Text style={styles.satRewardText}>+{currentResult?.totalSatsEarned} SATS</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalPrimaryBtnText}>Continuar Aventura</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() => {
                  setModalVisible(false);
                  router.push('/wallet');
                }}
              >
                <Text style={styles.modalSecondaryBtnText}>Ver Minha Carteira</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  rollsCounterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: BitcoinColors.surfaceElevated,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  rollsCounterText: {
    color: BitcoinColors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  arenaContainer: {
    width: DIE_SIZE,
    height: DIE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  runeRing: {
    position: 'absolute',
    width: DIE_SIZE + 10,
    height: DIE_SIZE + 10,
    borderRadius: (DIE_SIZE + 10) / 2,
    borderWidth: 2,
    borderColor: 'rgba(247, 147, 26, 0.2)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  runeDotTop: {
    position: 'absolute',
    top: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BitcoinColors.bitcoin,
  },
  runeDotBottom: {
    position: 'absolute',
    bottom: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BitcoinColors.bitcoin,
  },
  runeDotLeft: {
    position: 'absolute',
    left: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BitcoinColors.bitcoin,
  },
  runeDotRight: {
    position: 'absolute',
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BitcoinColors.bitcoin,
  },
  canvasContainer: {
    width: DIE_SIZE,
    height: DIE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  threeDTag: {
    position: 'absolute',
    bottom: 2,
    backgroundColor: 'rgba(20, 24, 36, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.3)',
    zIndex: 10,
  },
  threeDTagText: {
    color: '#FFB800',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  rollButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFD700',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 18,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  rollButtonDisabled: {
    backgroundColor: BitcoinColors.surfaceElevated,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  rollButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  rollButtonTextDisabled: {
    color: BitcoinColors.textSecondary,
  },
  tierGuideCard: {
    width: '100%',
    backgroundColor: BitcoinColors.surface,
    padding: 16,
    borderRadius: 18,
    marginTop: 20,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  tierGuideTitle: {
    color: BitcoinColors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  tierList: {
    gap: 8,
  },
  tierItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  tierTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    width: 82,
    alignItems: 'center',
  },
  tierTagText: {
    fontSize: 10,
    fontWeight: '900',
  },
  tierLabel: {
    color: BitcoinColors.text,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    marginLeft: 10,
  },
  tierSats: {
    color: BitcoinColors.bitcoin,
    fontSize: 12,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 12, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  bg3ModalContent: {
    width: '100%',
    backgroundColor: '#121622',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: BitcoinColors.borderHighlight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  crestCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(247, 147, 26, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: BitcoinColors.bitcoin,
    marginBottom: 14,
  },
  crestCircleCrit: {
    backgroundColor: 'rgba(255, 215, 0, 0.25)',
    borderColor: '#FFD700',
  },
  modalTierTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalTierDesc: {
    color: BitcoinColors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 18,
  },
  calcBox: {
    width: '100%',
    backgroundColor: BitcoinColors.surfaceElevated,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
    marginBottom: 16,
    gap: 6,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calcLabel: {
    color: BitcoinColors.textSecondary,
    fontSize: 13,
  },
  calcValueBold: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  calcBonus: {
    color: BitcoinColors.success,
    fontSize: 14,
    fontWeight: '800',
  },
  calcDivider: {
    height: 1,
    backgroundColor: BitcoinColors.border,
    marginVertical: 4,
  },
  calcTotalLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  calcTotalValue: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '900',
  },
  satRewardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(247, 147, 26, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BitcoinColors.bitcoin,
    marginBottom: 20,
  },
  satRewardText: {
    color: BitcoinColors.bitcoin,
    fontSize: 24,
    fontWeight: '900',
  },
  modalButtons: {
    width: '100%',
    gap: 10,
  },
  modalPrimaryBtn: {
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalPrimaryBtnText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '900',
  },
  modalSecondaryBtn: {
    backgroundColor: BitcoinColors.surfaceElevated,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  modalSecondaryBtnText: {
    color: BitcoinColors.text,
    fontSize: 13,
    fontWeight: '700',
  },
});
