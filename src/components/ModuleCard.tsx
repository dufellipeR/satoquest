import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Module } from '@/types';
import { useGame, triggerHaptic } from '@/context/GameContext';
import { BitcoinColors } from '@/constants/theme';

interface ModuleCardProps {
  module: Module;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  const router = useRouter();
  const { userState } = useGame();

  const totalLessons = module.lessons.length;
  const completedInModule = module.lessons.filter(l =>
    userState.completedLessonIds.includes(l.id)
  ).length;
  const progressPercent = Math.round((completedInModule / totalLessons) * 100);
  const isModuleFullyDone = completedInModule === totalLessons;

  return (
    <View style={styles.card}>
      {/* Module Header */}
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: `${module.color}20` }]}>
          <Ionicons name={module.icon as any} size={24} color={module.color} />
        </View>

        <View style={styles.headerInfo}>
          <View style={styles.badgeRow}>
            <Text style={[styles.moduleTag, { color: module.color }]}>
              MÓDULO {module.number}
            </Text>
            {isModuleFullyDone && (
              <View style={styles.doneBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#FFFFFF" />
                <Text style={styles.doneBadgeText}>CONCLUÍDO</Text>
              </View>
            )}
          </View>
          <Text style={styles.title}>{module.title}</Text>
          <Text style={styles.subtitle}>{module.subtitle}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPercent}%`, backgroundColor: module.color },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {completedInModule}/{totalLessons} ({progressPercent}%)
        </Text>
      </View>

      {/* Lessons List */}
      <View style={styles.lessonsList}>
        {module.lessons.map((lesson, idx) => {
          const isDone = userState.completedLessonIds.includes(lesson.id);
          return (
            <TouchableOpacity
              key={lesson.id}
              style={[styles.lessonRow, isDone && styles.lessonRowDone]}
              onPress={() => {
                triggerHaptic('selection');
                router.push({
                  pathname: '/lesson/[id]',
                  params: { id: lesson.id },
                });
              }}
              activeOpacity={0.7}
            >
              <View style={styles.lessonLeft}>
                <View style={[styles.checkCircle, isDone && styles.checkCircleDone]}>
                  <Ionicons
                    name={isDone ? 'checkmark' : 'play'}
                    size={14}
                    color={isDone ? '#FFFFFF' : BitcoinColors.textSecondary}
                  />
                </View>
                <View style={styles.lessonTextGroup}>
                  <Text style={[styles.lessonTitle, isDone && styles.lessonTitleDone]}>
                    {lesson.title}
                  </Text>
                  <Text style={styles.lessonMeta}>
                    {lesson.durationMin} min • +{lesson.xpReward} XP • +1 Giro 🎡
                  </Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={18} color={BitcoinColors.textMuted} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: BitcoinColors.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  header: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  moduleTag: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  doneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: BitcoinColors.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  doneBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: BitcoinColors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  progressBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: BitcoinColors.surfaceElevated,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    color: BitcoinColors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  lessonsList: {
    gap: 8,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BitcoinColors.surfaceElevated,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  lessonRowDone: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  lessonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: BitcoinColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  checkCircleDone: {
    backgroundColor: BitcoinColors.success,
    borderColor: BitcoinColors.success,
  },
  lessonTextGroup: {
    flex: 1,
  },
  lessonTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  lessonTitleDone: {
    color: '#FFFFFF',
  },
  lessonMeta: {
    color: BitcoinColors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
});
