import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { HeaderStats } from '@/components/HeaderStats';
import { ModuleCard } from '@/components/ModuleCard';
import { MODULES } from '@/constants/curriculum';
import { BitcoinColors } from '@/constants/theme';
import { useGame, triggerHaptic } from '@/context/GameContext';

export default function LearnScreen() {
  const router = useRouter();
  const { userState } = useGame();

  const totalLessons = MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = userState.completedLessonIds.length;
  const overallPercent = Math.round((completedCount / totalLessons) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderStats />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome / Motivation Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <View style={styles.tagBadge}>
              <Ionicons name="sparkles" size={12} color="#FFD700" />
              <Text style={styles.tagBadgeText}>EDUCAÇÃO BITCOIN</Text>
            </View>
            <Text style={styles.heroTitle}>Sua Jornada para a Soberania</Text>
            <Text style={styles.heroSubtitle}>
              Estude conceitos sólidos, gire a roleta e ganhe satoshinhos a cada lição!
            </Text>
          </View>

          <View style={styles.heroProgressBox}>
            <Text style={styles.progressNumber}>{overallPercent}%</Text>
            <Text style={styles.progressLabel}>Concluído</Text>
          </View>
        </View>

        {/* Lucky Wheel Alert Banner if spins available */}
        {userState.spinsAvailable > 0 && (
          <TouchableOpacity
            style={styles.wheelAlertCard}
            onPress={() => {
              triggerHaptic('impact');
              router.push('/wheel');
            }}
            activeOpacity={0.85}
          >
            <View style={styles.wheelAlertLeft}>
              <View style={styles.wheelAlertIcon}>
                <Ionicons name="disc" size={24} color="#000000" />
              </View>
              <View>
                <Text style={styles.wheelAlertTitle}>
                  Você tem {userState.spinsAvailable} giro{userState.spinsAvailable > 1 ? 's' : ''} esperando!
                </Text>
                <Text style={styles.wheelAlertDesc}>Gire a roleta agora para coletar satoshis 🎁</Text>
              </View>
            </View>
            <Ionicons name="arrow-forward" size={18} color="#000000" />
          </TouchableOpacity>
        )}

        {/* Modules Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trilhas de Conhecimento</Text>
          <Text style={styles.sectionSub}>4 Módulos Progressivos</Text>
        </View>

        {/* Modules List */}
        {MODULES.map(module => (
          <ModuleCard key={module.id} module={module} />
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
    paddingBottom: 32,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BitcoinColors.surface,
    padding: 20,
    borderRadius: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  heroLeft: {
    flex: 1,
    paddingRight: 12,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  tagBadgeText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: BitcoinColors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  heroProgressBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: BitcoinColors.surfaceElevated,
    borderWidth: 3,
    borderColor: BitcoinColors.bitcoin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressNumber: {
    color: BitcoinColors.bitcoin,
    fontSize: 16,
    fontWeight: '900',
  },
  progressLabel: {
    color: BitcoinColors.textMuted,
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  wheelAlertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFD700',
    padding: 14,
    borderRadius: 16,
    marginBottom: 20,
  },
  wheelAlertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  wheelAlertIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelAlertTitle: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
  },
  wheelAlertDesc: {
    color: 'rgba(0, 0, 0, 0.75)',
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  sectionSub: {
    color: BitcoinColors.textSecondary,
    fontSize: 12,
  },
});
