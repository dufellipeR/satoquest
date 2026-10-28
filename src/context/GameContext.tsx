import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { UserState, Transaction, D20Result } from '@/types';
import { loadStoredUserState, saveStoredUserState, INITIAL_USER_STATE } from '@/services/storage';
import { MODULES } from '@/constants/curriculum';

interface WithdrawalParams {
  method: 'lightning' | 'onchain';
  destination: string;
  amountSats: number;
  feeRate?: number;
}

interface GameContextType {
  userState: UserState;
  isLoading: boolean;
  completeLesson: (lessonId: string, earnedXp: number) => Promise<{ unlockedBadges: string[]; gainedRolls: number }>;
  rollD20: () => Promise<D20Result>;
  simulateWithdrawal: (params: WithdrawalParams) => Promise<{ success: boolean; txHash?: string; error?: string }>;
  resetProgress: () => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const triggerHaptic = (type: 'success' | 'warning' | 'impact' | 'selection' | 'heavy' = 'impact') => {
  if (Platform.OS === 'web') return;
  try {
    if (type === 'success') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (type === 'warning') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else if (type === 'heavy') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else if (type === 'selection') {
      Haptics.selectionAsync();
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  } catch {
    // Graceful fallback
  }
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userState, setUserState] = useState<UserState>(INITIAL_USER_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      const stored = await loadStoredUserState();
      
      const today = new Date().toISOString().slice(0, 10);
      let updatedStreak = stored.streakDays || 1;
      
      if (stored.lastActiveDate && stored.lastActiveDate !== today) {
        const lastDate = new Date(stored.lastActiveDate);
        const currDate = new Date(today);
        const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          updatedStreak += 1;
        } else if (diffDays > 1) {
          updatedStreak = 1;
        }
      }

      const refreshedState: UserState = {
        ...stored,
        streakDays: updatedStreak,
        lastActiveDate: today,
      };

      setUserState(refreshedState);
      await saveStoredUserState(refreshedState);
      setIsLoading(false);
    };

    init();
  }, []);

  const updateStateAndPersist = async (updater: (prev: UserState) => UserState) => {
    setUserState(prev => {
      const next = updater(prev);
      saveStoredUserState(next);
      return next;
    });
  };

  const completeLesson = async (
    lessonId: string,
    earnedXp: number
  ): Promise<{ unlockedBadges: string[]; gainedRolls: number }> => {
    triggerHaptic('success');
    let newlyUnlockedBadges: string[] = [];
    let rollsAwarded = 1; // 1 D20 roll per lesson completed

    setUserState(prev => {
      const alreadyCompleted = prev.completedLessonIds.includes(lessonId);
      const updatedCompleted = alreadyCompleted
        ? prev.completedLessonIds
        : [...prev.completedLessonIds, lessonId];

      const newXp = prev.xp + earnedXp;
      const newLevel = Math.floor(newXp / 150) + 1;
      
      const newUnlockedBadges = [...prev.unlockedBadgeIds];

      // Check badge: first-step
      if (!newUnlockedBadges.includes('badge-first-step')) {
        newUnlockedBadges.push('badge-first-step');
        newlyUnlockedBadges.push('badge-first-step');
      }

      // Check module completions
      MODULES.forEach(mod => {
        const allLessonsInMod = mod.lessons.map(l => l.id);
        const allDone = allLessonsInMod.every(id => updatedCompleted.includes(id));
        if (allDone && !newUnlockedBadges.includes(mod.badgeId)) {
          newUnlockedBadges.push(mod.badgeId);
          newlyUnlockedBadges.push(mod.badgeId);
          rollsAwarded += 2; // Extra bonus D20 rolls for completing a full module!
        }
      });

      const nextState: UserState = {
        ...prev,
        xp: newXp,
        level: newLevel,
        diceRollsAvailable: (prev.diceRollsAvailable ?? 0) + rollsAwarded,
        completedLessonIds: updatedCompleted,
        unlockedBadgeIds: newUnlockedBadges,
      };

      saveStoredUserState(nextState);
      return nextState;
    });

    return { unlockedBadges: newlyUnlockedBadges, gainedRolls: rollsAwarded };
  };

  const rollD20 = async (): Promise<D20Result> => {
    if (userState.diceRollsAvailable <= 0) {
      throw new Error('Você não possui rolagens de D20 disponíveis. Conclua lições para ganhar rolagens!');
    }

    triggerHaptic('heavy');

    // Roll 1 to 20
    const baseRoll = Math.floor(Math.random() * 20) + 1;

    // Baldur's Gate style Proficiency/Streak modifier
    const proficiencyBonus = Math.min(4, Math.floor(userState.level / 2));
    const streakBonus = userState.streakDays >= 2 ? 1 : 0;
    const totalModifier = proficiencyBonus + streakBonus;
    const total = baseRoll + totalModifier;

    let tier: D20Result['tier'];
    let tierTitle = '';
    let tierDescription = '';
    let baseSats = 0;
    let bonusSats = 0;

    if (baseRoll === 20) {
      tier = 'crit_success';
      tierTitle = '20 NATURAL! SUCESSO CRÍTICO LENDÁRIO! ⚔️🔥';
      tierDescription = 'O consenso absoluto da rede sorriu para você! Prêmio Máximo de Satoshi!';
      baseSats = 1000;
      bonusSats = totalModifier * 50;
    } else if (baseRoll === 1) {
      tier = 'crit_fail';
      tierTitle = '1 NATURAL! Falha Crítica... mas Satoshi tem piedade! 🧙‍♂️';
      tierDescription = 'No Bitcoin até o erro gera aprendizado e satoshinhos!';
      baseSats = 21;
      bonusSats = 0;
    } else if (total >= 18) {
      tier = 'superior';
      tierTitle = 'Sucesso Crítico Superior! 🛡️';
      tierDescription = 'Prova de Trabalho executada com excelência máxima!';
      baseSats = 210;
      bonusSats = totalModifier * 20;
    } else if (total >= 12) {
      tier = 'solid';
      tierTitle = 'Sucesso Sólido! ⚡';
      tierDescription = 'Transação validada e propagada pelos nós da rede.';
      baseSats = 100;
      bonusSats = totalModifier * 10;
    } else {
      tier = 'common';
      tierTitle = 'Sucesso Comum! 🪙';
      tierDescription = 'Micropagamento efetuado com sucesso via Lightning!';
      baseSats = 50;
      bonusSats = totalModifier * 5;
    }

    const totalEarned = baseSats + bonusSats;
    const nextTotalSats = userState.satsBalance + totalEarned;

    const newTx: Transaction = {
      id: `tx-dice-${Date.now()}`,
      type: 'reward',
      amount: totalEarned,
      description: `Rolagem D20 [D${baseRoll}${totalModifier > 0 ? `+${totalModifier}` : ''} = ${total}] (+${totalEarned} sats) 🎲`,
      timestamp: Date.now(),
      status: 'confirmed',
    };

    setUserState(prev => {
      const newBadges = [...prev.unlockedBadgeIds];
      if (!newBadges.includes('badge-first-roll')) {
        newBadges.push('badge-first-roll');
      }
      if (baseRoll === 20 && !newBadges.includes('badge-nat-20')) {
        newBadges.push('badge-nat-20');
      }
      if (nextTotalSats >= 500 && !newBadges.includes('badge-wealthy')) {
        newBadges.push('badge-wealthy');
      }
      if (nextTotalSats >= 1500 && !newBadges.includes('badge-whale')) {
        newBadges.push('badge-whale');
      }

      const nextState: UserState = {
        ...prev,
        satsBalance: nextTotalSats,
        diceRollsAvailable: Math.max(0, (prev.diceRollsAvailable ?? 1) - 1),
        unlockedBadgeIds: newBadges,
        transactions: [newTx, ...prev.transactions],
      };

      saveStoredUserState(nextState);
      return nextState;
    });

    return {
      baseRoll,
      modifier: totalModifier,
      modifierName: `Nível ${userState.level} (+${proficiencyBonus}) ${streakBonus > 0 ? '+ Streak (+1)' : ''}`,
      total,
      tier,
      tierTitle,
      tierDescription,
      satsPrize: baseSats,
      bonusSats,
      totalSatsEarned: totalEarned,
      newTotalSats: nextTotalSats,
    };
  };

  const simulateWithdrawal = async (
    params: WithdrawalParams
  ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
    if (params.amountSats <= 0) {
      return { success: false, error: 'O valor de saque deve ser superior a 0 satoshis.' };
    }
    if (params.amountSats > userState.satsBalance) {
      return { success: false, error: 'Saldo insuficiente para realizar esta transação.' };
    }
    if (!params.destination || params.destination.trim().length < 5) {
      return { success: false, error: 'Por favor, insira um endereço ou fatura válida.' };
    }

    triggerHaptic('success');

    // Generate random 64-character authentic-looking transaction hash
    const chars = '0123456789abcdef';
    let txHash = '';
    for (let i = 0; i < 64; i++) {
      txHash += chars[Math.floor(Math.random() * chars.length)];
    }

    const tx: Transaction = {
      id: `tx-out-${Date.now()}`,
      type: 'withdrawal',
      method: params.method,
      amount: params.amountSats,
      destination: params.destination,
      txHash,
      feeSats: params.feeRate || (params.method === 'lightning' ? 1 : 12),
      description: `Saque ${params.method === 'lightning' ? 'Lightning Network ⚡' : 'On-Chain ⛓️'}`,
      timestamp: Date.now(),
      status: 'confirmed',
    };

    setUserState(prev => {
      const newBadges = [...prev.unlockedBadgeIds];
      if (!newBadges.includes('badge-withdrawal')) {
        newBadges.push('badge-withdrawal');
      }

      const nextState: UserState = {
        ...prev,
        satsBalance: prev.satsBalance - params.amountSats,
        unlockedBadgeIds: newBadges,
        transactions: [tx, ...prev.transactions],
      };

      saveStoredUserState(nextState);
      return nextState;
    });

    return { success: true, txHash };
  };

  const resetProgress = async () => {
    triggerHaptic('warning');
    setUserState(INITIAL_USER_STATE);
    await saveStoredUserState(INITIAL_USER_STATE);
  };

  const updateUserName = async (name: string) => {
    await updateStateAndPersist(prev => ({ ...prev, name: name.trim() || 'Aventureiro Bitcoin' }));
  };

  return (
    <GameContext.Provider
      value={{
        userState,
        isLoading,
        completeLesson,
        rollD20,
        simulateWithdrawal,
        resetProgress,
        updateUserName,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
