import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EcosystemTool } from '@/types';
import { BitcoinColors } from '@/constants/theme';
import { triggerHaptic } from '@/context/GameContext';

interface ToolCardProps {
  tool: EcosystemTool;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const handleOpenLink = async () => {
    triggerHaptic('selection');
    try {
      const canOpen = await Linking.canOpenURL(tool.url);
      if (canOpen) {
        await Linking.openURL(tool.url);
      }
    } catch {
      console.warn('Não foi possível abrir o link:', tool.url);
    }
  };

  const getDifficultyColor = () => {
    switch (tool.difficulty) {
      case 'Iniciante':
        return BitcoinColors.success;
      case 'Intermediário':
        return BitcoinColors.bitcoin;
      case 'Avançado':
        return '#8B5CF6';
      default:
        return BitcoinColors.textSecondary;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{tool.category}</Text>
        </View>

        <View style={[styles.diffBadge, { borderColor: getDifficultyColor() }]}>
          <Text style={[styles.diffText, { color: getDifficultyColor() }]}>{tool.difficulty}</Text>
        </View>
      </View>

      <View style={styles.titleRow}>
        <View style={styles.iconContainer}>
          <Ionicons name={tool.iconName as any || 'globe-outline'} size={24} color={BitcoinColors.bitcoin} />
        </View>
        <View style={styles.titleGroup}>
          <Text style={styles.toolName}>{tool.name}</Text>
          <Text style={styles.tagline}>{tool.tagline}</Text>
        </View>
      </View>

      <Text style={styles.description}>{tool.description}</Text>

      <View style={styles.whyBox}>
        <Ionicons name="sparkles" size={14} color={BitcoinColors.bitcoinGold} />
        <Text style={styles.whyText}>
          <Text style={styles.whyBold}>Por que usar: </Text>
          {tool.whyUseIt}
        </Text>
      </View>

      <TouchableOpacity style={styles.actionBtn} onPress={handleOpenLink} activeOpacity={0.8}>
        <Text style={styles.actionBtnText}>Acessar Ferramenta</Text>
        <Ionicons name="open-outline" size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: BitcoinColors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: BitcoinColors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  categoryText: {
    color: BitcoinColors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  diffText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(247, 147, 26, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleGroup: {
    flex: 1,
  },
  toolName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  tagline: {
    color: BitcoinColors.textSecondary,
    fontSize: 12,
  },
  description: {
    color: BitcoinColors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  whyBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: BitcoinColors.surfaceElevated,
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  whyText: {
    color: BitcoinColors.text,
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  whyBold: {
    color: BitcoinColors.bitcoinGold,
    fontWeight: '700',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BitcoinColors.surfaceHighlight,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
