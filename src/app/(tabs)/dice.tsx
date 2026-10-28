import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { HeaderStats } from '@/components/HeaderStats';
import { D20Dice } from '@/components/D20Dice';
import { BitcoinColors } from '@/constants/theme';

export default function DiceScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderStats />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBox}>
          <View style={styles.iconTag}>
            <MaterialCommunityIcons name="dice-d20" size={16} color={BitcoinColors.bitcoinGold} />
            <Text style={styles.iconTagText}>ESTILO BALDUR'S GATE & D&D</Text>
          </View>
          <Text style={styles.title}>O Dado do Destino (D20)</Text>
          <Text style={styles.subtitle}>
            Invoque o poder do consenso descentralizado. Role o D20 e colete satoshinhos a cada conquista!
          </Text>
        </View>

        {/* D20 Component */}
        <D20Dice />

        {/* Rules & Modifiers Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Como Ganhar Mais Rolagens e Bônus?</Text>

          <View style={styles.infoRow}>
            <Ionicons name="checkmark-circle" size={18} color={BitcoinColors.success} />
            <Text style={styles.infoText}>
              <Text style={styles.infoHighlight}>+1 Rolagem </Text> a cada lição do currículo concluída.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="trophy" size={18} color={BitcoinColors.bitcoinGold} />
            <Text style={styles.infoText}>
              <Text style={styles.infoHighlight}>+2 Rolagens Bônus </Text> ao finalizar um módulo completo.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="flame" size={18} color="#FF6B35" />
            <Text style={styles.infoText}>
              <Text style={styles.infoHighlight}>Bônus de Proficiência: </Text>
              Seu Nível e Streak adicionam modificadores positivos (+1, +2, +3...) ao resultado do dado!
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
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 8,
  },
  iconTagText: {
    color: BitcoinColors.bitcoinGold,
    fontSize: 10,
    fontWeight: '900',
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
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
    gap: 12,
    marginTop: 10,
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
