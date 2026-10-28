import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGame } from '@/context/GameContext';
import { BitcoinColors } from '@/constants/theme';

export const HeaderStats: React.FC = () => {
  const { userState } = useGame();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const rollsCount = userState.diceRollsAvailable ?? 0;

  return (
    // O inset do topo é aplicado aqui (e não no SafeAreaView das telas) para o
    // background do header se estender sob a status bar, em vez de aparecer o
    // fundo da tela como uma faixa de outra cor.
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {/* Level & Streak */}
      <View style={styles.leftGroup}>
        <View style={styles.statPill}>
          <Ionicons name="flash" size={14} color={BitcoinColors.lightningCyan} />
          <Text style={styles.statText}>Nível {userState.level}</Text>
        </View>

        <View style={styles.statPill}>
          <Ionicons name="flame" size={15} color="#FF6B35" />
          <Text style={styles.statText}>{userState.streakDays}d</Text>
        </View>
      </View>

      {/* Sats Balance & D20 Rolls */}
      <View style={styles.rightGroup}>
        {rollsCount > 0 && (
          <TouchableOpacity
            style={[styles.statPill, styles.dicePill]}
            onPress={() => router.push('/dice')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="dice-d20" size={16} color="#FFD700" />
            <Text style={styles.diceText}>
              {rollsCount} D20{rollsCount > 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.statPill, styles.satsPill]}
          onPress={() => router.push('/wallet')}
          activeOpacity={0.8}
        >
          <Ionicons name="logo-bitcoin" size={15} color={BitcoinColors.bitcoin} />
          <Text style={styles.satsText}>{userState.satsBalance.toLocaleString('pt-BR')} sats</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: BitcoinColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: BitcoinColors.border,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: BitcoinColors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  statText: {
    color: BitcoinColors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  dicePill: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  diceText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '800',
  },
  satsPill: {
    backgroundColor: 'rgba(247, 147, 26, 0.15)',
    borderColor: 'rgba(247, 147, 26, 0.35)',
  },
  satsText: {
    color: BitcoinColors.bitcoin,
    fontSize: 13,
    fontWeight: '800',
  },
});
