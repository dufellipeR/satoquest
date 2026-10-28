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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { WHEEL_PRIZES, useGame, triggerHaptic } from '@/context/GameContext';
import { BitcoinColors } from '@/constants/theme';

const { width } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(width - 48, 300);

export const LuckyWheel: React.FC = () => {
  const { userState, spinWheel } = useGame();
  const router = useRouter();
  const spinAnim = useRef(new Animated.Value(0)).current;
  const currentRotation = useRef(0);

  const [isSpinning, setIsSpinning] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [wonPrize, setWonPrize] = useState<{ sats: number; newTotal: number } | null>(null);

  const handleSpin = async () => {
    if (isSpinning || userState.spinsAvailable <= 0) return;

    try {
      setIsSpinning(true);
      triggerHaptic('impact');

      const result = await spinWheel();
      const prizeIndex = result.prizeIndex;

      // Calculate destination angle
      // 6 slices of 60 degrees each.
      // Slices indices: 0: 21, 1: 50, 2: 100, 3: 210, 4: 500, 5: 1000
      const sliceAngle = 360 / WHEEL_PRIZES.length;
      // We want slice at prizeIndex to align with pointer at top (0 deg).
      // Angle to place index under top pointer:
      const sliceCenter = prizeIndex * sliceAngle + sliceAngle / 2;
      const targetAngle = 360 - sliceCenter;

      // Add 5 full rotations (1800 deg)
      const totalDegrees = currentRotation.current + 1800 + (targetAngle - (currentRotation.current % 360));
      currentRotation.current = totalDegrees;

      Animated.timing(spinAnim, {
        toValue: totalDegrees,
        duration: 4200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setIsSpinning(false);
        triggerHaptic('success');
        setWonPrize({
          sats: result.prizeSats,
          newTotal: result.newTotalSats,
        });
        setModalVisible(true);
      });
    } catch (err: any) {
      setIsSpinning(false);
      console.warn('Erro ao girar roleta:', err.message);
    }
  };

  const spinInterpolation = spinAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Spins Available Indicator */}
      <View style={styles.spinsCounterCard}>
        <Ionicons name="sparkles" size={18} color="#FFD700" />
        <Text style={styles.spinsCounterText}>
          {userState.spinsAvailable > 0
            ? `Você tem ${userState.spinsAvailable} giro${userState.spinsAvailable > 1 ? 's' : ''} disponível!`
            : 'Conclua lições para ganhar novos giros na roleta!'}
        </Text>
      </View>

      {/* Wheel Area with Pointer */}
      <View style={styles.wheelWrapper}>
        {/* Top Pointer Needle */}
        <View style={styles.pointerContainer}>
          <View style={styles.pointerNeedle} />
        </View>

        {/* Rotating Wheel Body */}
        <Animated.View
          style={[
            styles.wheelBody,
            {
              transform: [{ rotate: spinInterpolation }],
            },
          ]}
        >
          {WHEEL_PRIZES.map((item, index) => {
            const angle = index * (360 / WHEEL_PRIZES.length);
            return (
              <View
                key={index}
                style={[
                  styles.sliceSegment,
                  {
                    transform: [{ rotate: `${angle}deg` }],
                  },
                ]}
              >
                <View
                  style={[
                    styles.sliceContent,
                    { backgroundColor: item.color },
                  ]}
                >
                  <Text style={styles.sliceText}>{item.label}</Text>
                </View>
              </View>
            );
          })}

          {/* Center Medallion */}
          <View style={styles.centerMedallion}>
            <View style={styles.centerInner}>
              <Ionicons name="logo-bitcoin" size={28} color="#FFFFFF" />
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Spin Button */}
      <TouchableOpacity
        style={[
          styles.spinButton,
          (userState.spinsAvailable <= 0 || isSpinning) && styles.spinButtonDisabled,
        ]}
        onPress={handleSpin}
        disabled={userState.spinsAvailable <= 0 || isSpinning}
        activeOpacity={0.85}
      >
        <Ionicons
          name={isSpinning ? 'sync' : 'play'}
          size={22}
          color="#FFFFFF"
          style={isSpinning ? styles.spinningIcon : undefined}
        />
        <Text style={styles.spinButtonText}>
          {isSpinning
            ? 'Girando a Roleta...'
            : userState.spinsAvailable > 0
            ? 'GIRAR AGORA!'
            : 'SEM GIROS DISPONÍVEIS'}
        </Text>
      </TouchableOpacity>

      {/* Prize Table / Legend */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Possíveis Prêmios</Text>
        <View style={styles.legendGrid}>
          {WHEEL_PRIZES.map((p, idx) => (
            <View key={idx} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: p.color }]} />
              <Text style={styles.legendText}>{p.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Success Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderIcon}>
              <Ionicons name="gift" size={42} color={BitcoinColors.bitcoinGold} />
            </View>

            <Text style={styles.modalTitle}>Sensacional! 🎉</Text>
            <Text style={styles.modalSubtitle}>A roleta da sorte te premiou com:</Text>

            <View style={styles.prizeBadge}>
              <Ionicons name="logo-bitcoin" size={28} color={BitcoinColors.bitcoin} />
              <Text style={styles.prizeBadgeText}>+{wonPrize?.sats} SATS</Text>
            </View>

            <Text style={styles.modalDesc}>
              Os satoshinhos foram creditados instantaneamente na sua carteira virtual!
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalPrimaryBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalPrimaryBtnText}>Girar Novamente</Text>
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
  spinsCounterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: BitcoinColors.surfaceElevated,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  spinsCounterText: {
    color: BitcoinColors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  wheelWrapper: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 28,
  },
  pointerContainer: {
    position: 'absolute',
    top: -12,
    zIndex: 10,
    alignItems: 'center',
  },
  pointerNeedle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderTopWidth: 26,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFD700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  wheelBody: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    backgroundColor: '#1C2333',
    borderWidth: 6,
    borderColor: '#FFD700',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BitcoinColors.bitcoin,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  sliceSegment: {
    position: 'absolute',
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    alignItems: 'center',
  },
  sliceContent: {
    width: WHEEL_SIZE * 0.46,
    height: WHEEL_SIZE * 0.28,
    marginTop: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sliceText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  centerMedallion: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    zIndex: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  centerInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: BitcoinColors.bitcoin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: BitcoinColors.bitcoin,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: BitcoinColors.bitcoin,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  spinButtonDisabled: {
    backgroundColor: BitcoinColors.surfaceElevated,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  spinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  spinningIcon: {
    transform: [{ rotate: '45deg' }],
  },
  legendContainer: {
    width: '100%',
    backgroundColor: BitcoinColors.surface,
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  legendTitle: {
    color: BitcoinColors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '45%',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: BitcoinColors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: BitcoinColors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BitcoinColors.borderHighlight,
  },
  modalHeaderIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  modalSubtitle: {
    color: BitcoinColors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  prizeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(247, 147, 26, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BitcoinColors.bitcoin,
    marginBottom: 16,
  },
  prizeBadgeText: {
    color: BitcoinColors.bitcoin,
    fontSize: 26,
    fontWeight: '900',
  },
  modalDesc: {
    color: BitcoinColors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  modalButtons: {
    width: '100%',
    gap: 10,
  },
  modalPrimaryBtn: {
    backgroundColor: BitcoinColors.bitcoin,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
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
    fontSize: 14,
    fontWeight: '700',
  },
});
