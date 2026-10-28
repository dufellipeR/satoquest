import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeaderStats } from '@/components/HeaderStats';
import { BADGES } from '@/constants/badges';
import { MODULES } from '@/constants/curriculum';
import { BitcoinColors } from '@/constants/theme';
import { useGame, triggerHaptic } from '@/context/GameContext';

export default function ProfileScreen() {
  const { userState, resetProgress, updateUserName } = useGame();
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [newName, setNewName] = useState(userState.name);

  const totalLessons = MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessonsCount = userState.completedLessonIds.length;

  const currentLevelXpBase = (userState.level - 1) * 150;
  const nextLevelXpTarget = userState.level * 150;
  const currentLevelXpProgress = userState.xp - currentLevelXpBase;
  const xpInThisLevel = 150;
  const xpPercent = Math.min(100, Math.max(0, Math.round((currentLevelXpProgress / xpInThisLevel) * 100)));

  const handleSaveName = async () => {
    if (newName.trim()) {
      await updateUserName(newName);
      setNameModalVisible(false);
      triggerHaptic('success');
    }
  };

  const handleResetConfirm = () => {
    triggerHaptic('warning');
    Alert.alert(
      'Reiniciar Progresso',
      'Tem certeza de que deseja resetar todo o seu progresso, lições e satoshis? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, Resetar',
          style: 'destructive',
          onPress: async () => {
            await resetProgress();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderStats />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarBox}>
            <Ionicons name="person" size={32} color={BitcoinColors.bitcoin} />
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{userState.name}</Text>
              <TouchableOpacity onPress={() => setNameModalVisible(true)} style={styles.editBtn}>
                <Ionicons name="pencil" size={14} color={BitcoinColors.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.userRole}>Nível {userState.level} • Entusiasta Bitcoin</Text>
          </View>
        </View>

        {/* Level XP Progress Card */}
        <View style={styles.xpCard}>
          <View style={styles.xpTopRow}>
            <Text style={styles.xpTitle}>Progresso de Nível</Text>
            <Text style={styles.xpDetails}>
              {userState.xp} / {nextLevelXpTarget} XP
            </Text>
          </View>

          <View style={styles.xpBarTrack}>
            <View style={[styles.xpBarFill, { width: `${xpPercent}%` }]} />
          </View>

          <Text style={styles.xpFooterText}>
            Faltam {Math.max(0, nextLevelXpTarget - userState.xp)} XP para alcançar o Nível {userState.level + 1}
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Ionicons name="book-outline" size={20} color={BitcoinColors.bitcoin} />
            <Text style={styles.statVal}>{completedLessonsCount}/{totalLessons}</Text>
            <Text style={styles.statLbl}>Lições Feitas</Text>
          </View>

          <View style={styles.statBox}>
            <Ionicons name="flame-outline" size={20} color="#FF6B35" />
            <Text style={styles.statVal}>{userState.streakDays} dias</Text>
            <Text style={styles.statLbl}>Streak Ativo</Text>
          </View>

          <View style={styles.statBox}>
            <Ionicons name="disc-outline" size={20} color="#FFD700" />
            <Text style={styles.statVal}>{userState.spinsAvailable}</Text>
            <Text style={styles.statLbl}>Giros Livres</Text>
          </View>

          <View style={styles.statBox}>
            <Ionicons name="trophy-outline" size={20} color={BitcoinColors.success} />
            <Text style={styles.statVal}>{userState.unlockedBadgeIds.length}/{BADGES.length}</Text>
            <Text style={styles.statLbl}>Conquistas</Text>
          </View>
        </View>

        {/* Badges Gallery */}
        <View style={styles.badgesSection}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Galeria de Conquistas</Text>
            <Text style={styles.sectionSubtitle}>
              {userState.unlockedBadgeIds.length} de {BADGES.length} desbloqueadas
            </Text>
          </View>

          <View style={styles.badgesList}>
            {BADGES.map(badge => {
              const isUnlocked = userState.unlockedBadgeIds.includes(badge.id);

              return (
                <View
                  key={badge.id}
                  style={[styles.badgeItem, isUnlocked && styles.badgeItemUnlocked]}
                >
                  <View
                    style={[
                      styles.badgeIconCircle,
                      isUnlocked && styles.badgeIconCircleUnlocked,
                    ]}
                  >
                    <Ionicons
                      name={badge.icon as any}
                      size={24}
                      color={isUnlocked ? BitcoinColors.bitcoinGold : BitcoinColors.textMuted}
                    />
                  </View>

                  <View style={styles.badgeTextContent}>
                    <View style={styles.badgeHeaderLine}>
                      <Text style={[styles.badgeTitle, isUnlocked && styles.badgeTitleUnlocked]}>
                        {badge.title}
                      </Text>
                      {isUnlocked && (
                        <View style={styles.badgeTag}>
                          <Text style={styles.badgeTagText}>CONQUISTADA</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.badgeDesc}>{badge.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Reset Progress Button */}
        <TouchableOpacity style={styles.resetButton} onPress={handleResetConfirm}>
          <Ionicons name="refresh-outline" size={16} color={BitcoinColors.error} />
          <Text style={styles.resetButtonText}>Reiniciar Todo o Progresso (Demo)</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Name Modal */}
      <Modal visible={nameModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Editar Nome</Text>
            <TextInput
              style={styles.nameInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Digite seu nome"
              placeholderTextColor={BitcoinColors.textMuted}
              maxLength={25}
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setNameModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveName}>
                <Text style={styles.modalSaveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: BitcoinColors.surface,
    padding: 18,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  avatarBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(247, 147, 26, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: BitcoinColors.bitcoin,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  editBtn: {
    padding: 2,
  },
  userRole: {
    color: BitcoinColors.textSecondary,
    fontSize: 12,
  },
  xpCard: {
    backgroundColor: BitcoinColors.surface,
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  xpTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  xpDetails: {
    color: BitcoinColors.bitcoin,
    fontSize: 12,
    fontWeight: '800',
  },
  xpBarTrack: {
    height: 8,
    backgroundColor: BitcoinColors.surfaceElevated,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: BitcoinColors.bitcoin,
    borderRadius: 4,
  },
  xpFooterText: {
    color: BitcoinColors.textMuted,
    fontSize: 11,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: BitcoinColors.surface,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BitcoinColors.border,
    gap: 4,
  },
  statVal: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  statLbl: {
    color: BitcoinColors.textMuted,
    fontSize: 10,
    textAlign: 'center',
  },
  badgesSection: {
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: BitcoinColors.textMuted,
    fontSize: 12,
  },
  badgesList: {
    gap: 10,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: BitcoinColors.surface,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
    opacity: 0.6,
  },
  badgeItemUnlocked: {
    opacity: 1,
    borderColor: 'rgba(255, 184, 0, 0.4)',
    backgroundColor: 'rgba(255, 184, 0, 0.04)',
  },
  badgeIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: BitcoinColors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  badgeIconCircleUnlocked: {
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    borderColor: BitcoinColors.bitcoinGold,
  },
  badgeTextContent: {
    flex: 1,
  },
  badgeHeaderLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  badgeTitle: {
    color: BitcoinColors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  badgeTitleUnlocked: {
    color: '#FFFFFF',
  },
  badgeTag: {
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeTagText: {
    color: BitcoinColors.bitcoinGold,
    fontSize: 9,
    fontWeight: '900',
  },
  badgeDesc: {
    color: BitcoinColors.textMuted,
    fontSize: 11,
    lineHeight: 15,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  resetButtonText: {
    color: BitcoinColors.error,
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: BitcoinColors.surface,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  nameInput: {
    backgroundColor: BitcoinColors.surfaceElevated,
    color: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
    fontSize: 15,
    marginBottom: 20,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: BitcoinColors.surfaceElevated,
    borderRadius: 10,
  },
  modalCancelText: {
    color: BitcoinColors.textSecondary,
    fontWeight: '700',
  },
  modalSaveBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: BitcoinColors.bitcoin,
    borderRadius: 10,
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
