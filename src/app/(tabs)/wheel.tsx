import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeaderStats } from '@/components/HeaderStats';
import { LuckyWheel } from '@/components/LuckyWheel';
import { BitcoinColors } from '@/constants/theme';

export default function WheelScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderStats />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBox}>
          <View style={styles.iconTag}>
            <Ionicons name="gift" size={16} color={BitcoinColors.bitcoinGold} />
            <Text style={styles.iconTagText}>RECOMPENSAS EDUCATIVAS</Text>
          </View>
          <Text style={styles.title}>Roleta dos Satoshis</Text>
          <Text style={styles.subtitle}>
            Conquiste conhecimento, gire a roleta e acumule satoshinhos reais em sua carteira virtual!
          </Text>
        </View>

        {/* Lucky Wheel Component */}
        <LuckyWheel />

        {/* How it works info card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Como Ganhar Mais Giros?</Text>

          <View style={styles.infoRow}>
            <Ionicons name="checkmark-circle" size={18} color={BitcoinColors.success} />
            <Text style={styles.infoText}>
              <Text style={styles.infoHighlight}>+1 Giro </Text> a cada lição concluída com sucesso.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="trophy" size={18} color={BitcoinColors.bitcoinGold} />
            <Text style={styles.infoText}>
              <Text style={styles.infoHighlight}>+2 Giros Bônus </Text> ao finalizar todos os módulos de uma trilha.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="flame" size={18} color="#FF6B35" />
            <Text style={styles.infoText}>
              Mantenha seu <Text style={styles.infoHighlight}>Streak Diário</Text> de estudos ativo.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BitcoinColors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerBox: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
    alignItems: 'center',
  },
  iconTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 184, 0, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  iconTagText: {
    color: BitcoinColors.bitcoinGold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    color: BitcoinColors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 320,
  },
  infoCard: {
    marginHorizontal: 16,
    backgroundColor: BitcoinColors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
    gap: 12,
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    color: BitcoinColors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  infoHighlight: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
