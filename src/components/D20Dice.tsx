import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Modal,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useGame, triggerHaptic } from '@/context/GameContext';
import { BitcoinColors } from '@/constants/theme';
import { D20Result } from '@/types';

const { width } = Dimensions.get('window');
const DIE_SIZE = Math.min(width - 64, 260);

export const D20Dice: React.FC = () => {
  const { userState, rollD20 } = useGame();
  const router = useRouter();

  const [isRolling, setIsRolling] = useState(false);
  const [displayNumber, setDisplayNumber] = useState<number | string>(20);
  const [rollResult, setRollResult] = useState<D20Result | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Animated values
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handleRoll = async () => {
    if (isRolling || userState.diceRollsAvailable <= 0) return;

    try {
      setIsRolling(true);
      triggerHaptic('heavy');

      // Start looping tumble animation
      rotateAnim.setValue(0);
      Animated.timing(rotateAnim, {
        toValue: 8, // Multiple full spins
        duration: 2600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }).start();

      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.25,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.05,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // Cycle numbers rapidly during roll for dramatic effect
      let tick = 0;
      const interval = setInterval(() => {
        tick++;
        const tempRandom = Math.floor(Math.random() * 20) + 1;
        setDisplayNumber(tempRandom);
        triggerHaptic('selection');

        if (tick > 18) {
          clearInterval(interval);
        }
      }, 120);

      // Call game logic
      const result = await rollD20();

      setTimeout(() => {
        setDisplayNumber(result.baseRoll);
        setIsRolling(false);
        setRollResult(result);

        if (result.baseRoll === 20) {
          triggerHaptic('success');
          // Pulse glow
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
          }).start();
        } else if (result.baseRoll === 1) {
          triggerHaptic('warning');
        } else {
          triggerHaptic('success');
        }

        // Open Baldur's Gate style result modal after brief landing impact
        setTimeout(() => {
          setModalVisible(true);
        }, 500);
      }, 2600);
    } catch (err: any) {
      setIsRolling(false);
      console.warn('Erro ao rolar D20:', err.message);
    }
  };

  const spinInterpolation = rotateAnim.interpolate({
    inputRange: [0, 8],
    outputRange: ['0deg', '1440deg'],
  });

  const isNat20 = displayNumber === 20;
  const isNat1 = displayNumber === 1;

  return (
    <View style={styles.container}>
      {/* Dice Counter Banner */}
      <View style={styles.rollsCounterCard}>
        <MaterialCommunityIcons name="dice-d20" size={20} color="#FFD700" />
        <Text style={styles.rollsCounterText}>
          {userState.diceRollsAvailable > 0
            ? `Você possui ${userState.diceRollsAvailable} rolagem${userState.diceRollsAvailable > 1 ? 'ns' : ''} de D20!`
            : 'Conclua lições para ganhar novas rolagens do D20!'}
        </Text>
      </View>

      {/* Baldur's Gate Arcane Dice Arena */}
      <View style={styles.arenaContainer}>
        {/* Outer Arcane Rune Ring */}
        <View style={styles.runeRing}>
          <View style={styles.runeDotTop} />
          <View style={styles.runeDotBottom} />
          <View style={styles.runeDotLeft} />
          <View style={styles.runeDotRight} />
        </View>

        {/* 3D-styled Animated D20 Die */}
        <Animated.View
          style={[
            styles.dieWrapper,
            {
              transform: [
                { rotate: spinInterpolation },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          {/* Icosahedron Facet Outer Frame */}
          <View
            style={[
              styles.d20OuterFrame,
              isNat20 && styles.d20CritGoldGlow,
              isNat1 && styles.d20CritFailGlow,
            ]}
          >
            {/* Facet Geometries */}
            <View style={styles.facetTopLeft} />
            <View style={styles.facetTopRight} />
            <View style={styles.facetBottom} />

            {/* Inner Center Pentagonal Face */}
            <View style={styles.d20FaceCenter}>
              <Text
                style={[
                  styles.dieNumberText,
                  isNat20 && styles.dieNumberTextCrit,
                  isNat1 && styles.dieNumberTextFail,
                ]}
              >
                {displayNumber}
              </Text>
              <Text style={styles.dieSubtitle}>
                {isNat20 ? 'NAT 20' : isNat1 ? 'FALHA' : 'D20'}
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Roll Action Button */}
      <TouchableOpacity
        style={[
          styles.rollButton,
          (userState.diceRollsAvailable <= 0 || isRolling) && styles.rollButtonDisabled,
        ]}
        onPress={handleRoll}
        disabled={userState.diceRollsAvailable <= 0 || isRolling}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons
          name={isRolling ? 'dice-d20-outline' : 'dice-d20'}
          size={24}
          color="#000000"
        />
        <Text style={styles.rollButtonText}>
          {isRolling
            ? 'ROLANDO D20...'
            : userState.diceRollsAvailable > 0
            ? 'ROLAR DADO D20'
            : 'SEM ROLAGENS DISPONÍVEIS'}
        </Text>
      </TouchableOpacity>

      {/* D&D Tiers Breakdown Table */}
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
                rollResult?.baseRoll === 20 && styles.crestCircleCrit,
              ]}
            >
              <MaterialCommunityIcons
                name="dice-d20"
                size={40}
                color={rollResult?.baseRoll === 20 ? '#FFD700' : BitcoinColors.bitcoin}
              />
            </View>

            <Text style={styles.modalTierTitle}>{rollResult?.tierTitle}</Text>
            <Text style={styles.modalTierDesc}>{rollResult?.tierDescription}</Text>

            {/* Baldur's Gate Breakdown Box */}
            <View style={styles.calcBox}>
              <View style={styles.calcRow}>
                <Text style={styles.calcLabel}>Rolagem no D20:</Text>
                <Text style={styles.calcValueBold}>{rollResult?.baseRoll}</Text>
              </View>

              {rollResult && rollResult.modifier > 0 && (
                <View style={styles.calcRow}>
                  <Text style={styles.calcLabel}>+ Bônus de Proficiência:</Text>
                  <Text style={styles.calcBonus}>+{rollResult.modifier}</Text>
                </View>
              )}

              <View style={styles.calcDivider} />

              <View style={styles.calcRow}>
                <Text style={styles.calcTotalLabel}>Resultado Final:</Text>
                <Text style={styles.calcTotalValue}>{rollResult?.total}</Text>
              </View>
            </View>

            {/* Satoshis Won Banner */}
            <View style={styles.satRewardBanner}>
              <Ionicons name="logo-bitcoin" size={26} color={BitcoinColors.bitcoin} />
              <Text style={styles.satRewardText}>+{rollResult?.totalSatsEarned} SATS</Text>
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
    paddingVertical: 16,
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
    marginBottom: 20,
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
    marginBottom: 24,
  },
  runeRing: {
    position: 'absolute',
    width: DIE_SIZE + 24,
    height: DIE_SIZE + 24,
    borderRadius: (DIE_SIZE + 24) / 2,
    borderWidth: 2,
    borderColor: 'rgba(247, 147, 26, 0.25)',
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
  dieWrapper: {
    width: DIE_SIZE,
    height: DIE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  d20OuterFrame: {
    width: DIE_SIZE - 20,
    height: DIE_SIZE - 20,
    backgroundColor: '#161B26',
    borderRadius: 36,
    borderWidth: 5,
    borderColor: BitcoinColors.bitcoin,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BitcoinColors.bitcoin,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  d20CritGoldGlow: {
    borderColor: '#FFD700',
    backgroundColor: '#2A1F0A',
    shadowColor: '#FFD700',
    shadowOpacity: 0.9,
    shadowRadius: 24,
  },
  d20CritFailGlow: {
    borderColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  facetTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50%',
    height: '50%',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  facetTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '50%',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  facetBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '40%',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  d20FaceCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  dieNumberText: {
    color: '#FFFFFF',
    fontSize: 68,
    fontWeight: '900',
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  dieNumberTextCrit: {
    color: '#FFD700',
    textShadowColor: 'rgba(255, 215, 0, 0.6)',
    textShadowRadius: 16,
  },
  dieNumberTextFail: {
    color: '#EF4444',
  },
  dieSubtitle: {
    color: BitcoinColors.bitcoin,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: -4,
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
  tierGuideCard: {
    width: '100%',
    backgroundColor: BitcoinColors.surface,
    padding: 16,
    borderRadius: 18,
    marginTop: 24,
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
