import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HeaderStats } from '@/components/HeaderStats';
import { ToolCard } from '@/components/ToolCard';
import { ECOSYSTEM_TOOLS } from '@/constants/tools';
import { BitcoinColors } from '@/constants/theme';
import { triggerHaptic } from '@/context/GameContext';

const CATEGORIES = ['Todos', 'Explorer', 'Carteira', 'Lightning', 'Privacidade', 'Hardware'] as const;

export default function ToolsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const filteredTools = selectedCategory === 'Todos'
    ? ECOSYSTEM_TOOLS
    : ECOSYSTEM_TOOLS.filter(t => t.category === selectedCategory);

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <HeaderStats />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Title */}
        <View style={styles.header}>
          <View style={styles.odsTag}>
            <Ionicons name="globe-outline" size={14} color={BitcoinColors.success} />
            <Text style={styles.odsTagText}>INCLUSÃO DIGITAL • ODS 4 & 8</Text>
          </View>
          <Text style={styles.title}>Ecossistema Bitcoin</Text>
          <Text style={styles.subtitle}>
            Conheça as ferramentas essenciais para auditar, guardar e utilizar satoshis com soberania e segurança.
          </Text>
        </View>

        {/* Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catPill, isSelected && styles.catPillActive]}
                onPress={() => {
                  triggerHaptic('selection');
                  setSelectedCategory(cat);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.catPillText, isSelected && styles.catPillTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Tools Count */}
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            Exibindo {filteredTools.length} ferramenta{filteredTools.length > 1 ? 's' : ''}
          </Text>
        </View>

        {/* Tools Cards */}
        {filteredTools.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
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
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  odsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  odsTagText: {
    color: BitcoinColors.success,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  subtitle: {
    color: BitcoinColors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  categoryScroll: {
    gap: 8,
    paddingVertical: 10,
    marginBottom: 10,
  },
  catPill: {
    backgroundColor: BitcoinColors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  catPillActive: {
    backgroundColor: BitcoinColors.bitcoin,
    borderColor: BitcoinColors.bitcoin,
  },
  catPillText: {
    color: BitcoinColors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  catPillTextActive: {
    color: '#FFFFFF',
  },
  countRow: {
    marginBottom: 12,
  },
  countText: {
    color: BitcoinColors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
});
