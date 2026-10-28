import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { UserState, Transaction } from '@/types';
import { loadStoredUserState, saveStoredUserState, INITIAL_USER_STATE } from '@/services/storage';
import { MODULES } from '@/constants/curriculum';
import { BADGES } from '@/constants/badges';

export const WHEEL_PRIZES = [
  { sats: 21, weight: 30, color: '#F7931A', label: '21 sats' },
  { sats: 50, weight: 30, color: '#3B82F6', label: '50 sats' },
  { sats: 100, weight: 20, color: '#10B981', label: '100 sats' },
  { sats: 210, weight: 12, color: '#8B5CF6', label: '210 sats' },
  { sats: 500, weight: 6, color: '#EC4899', label: '500 sats' },
  { sats: 1000, weight: 2, color: '#FFB800', label: '1000 sats 🏆' },
];

interface WithdrawalParams {
  method: 'lightning' | 'onchain';
  destination: string;
  amountSats: number;
  feeRate?: number;
}

interface GameContextType {
  userState: UserState;
  isLoading: boolean;
  completeLesson: (lessonId: string, earnedXp: number) => Promise<{ unlockedBadges: string[]; gainedSpins: number }>;
  spinWheel: () => Promise<{ prizeSats: number; prizeIndex: number; newTotalSats: number }>;
  simulateWithdrawal: (params: WithdrawalParams) => Promise<{ success: boolean; txHash?: string; error?: string }>;
  resetProgress: () => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const triggerHaptic = (type: 'success' | 'warning' | 'impact' | 'selection' = 'impact') => {
  if (Platform.OS === 'web') return;
  try {
    if (type === 'success') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (type === 'warning') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else if (type === 'selection') {
      Haptics.selectionAsync();
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  } catch {
    // Ignore on unsupported devices
  }
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userState, setUserState] = useState<UserState>(INITIAL_USER_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      const stored = await loadStoredUserState();
      
      // Calculate streak
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
  ): Promise<{ unlockedBadges: string[]; gainedSpins: number }> => {
    triggerHaptic('success');
    let newlyUnlockedBadges: string[] = [];
    let spinsAwarded = 1; // Base 1 spin for lesson completion

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
          spinsAwarded += 2; // Extra bonus spins for completing a full module!
        }
      });

      const nextState: UserState = {
        ...prev,
        xp: newXp,
        level: newLevel,
        spinsAvailable: prev.spinsAvailable + spinsAwarded,
        completedLessonIds: updatedCompleted,
        unlockedBadgeIds: newUnlockedBadges,
      };

      saveStoredUserState(nextState);
      return nextState;
    });

    return { unlockedBadges: newlyUnlockedBadges, gainedSpins: spinsAwarded };
  };

  const spinWheel = async (): Promise<{ prizeSats: number; prizeIndex: number; newTotalSats: number }> => {
    if (userState.spinsAvailable <= 0) {
      throw new Error('Você não possui giros disponíveis. Complete lições para ganhar novos giros!');
    }

    triggerHaptic('impact');

    // Weighted random selection
    const totalWeight = WHEEL_PRIZES.reduce((acc, p) => acc + p.weight, 0);
    let rand = Math.random() * totalWeight;
    let selectedIndex = 0;

    for (let i = 0; i < WHEEL_PRIZES.length; i++) {
      if (rand < WHEEL_PRIZES[i].weight) {
        selectedIndex = i;
        break;
      }
      rand -= WHEEL_PRIZES[i].weight;
    }

    const wonPrize = WHEEL_PRIZES[selectedIndex];
    const newTx: Transaction = {
      id: `tx-spin-${Date.now()}`,
      type: 'reward',
      amount: wonPrize.sats,
      description: `Giro da Roleta da Sorte (+${wonPrize.sats} sats) 🎡`,
      timestamp: Date.now(),
      status: 'confirmed',
    };

    let nextTotalSats = userState.satsBalance + wonPrize.sats;

    setUserState(prev => {
      const newBadges = [...prev.unlockedBadgeIds];
      if (!newBadges.includes('badge-first-spin')) {
        newBadges.push('badge-first-spin');
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
        spinsAvailable: Math.max(0, prev.spinsAvailable - 1),
        unlockedBadgeIds: newBadges,
        transactions: [newTx, ...prev.transactions],
      };

      saveStoredUserState(nextState);
      return nextState;
    });

    return {
      prizeSats: wonPrize.sats,
      prizeIndex: selectedIndex,
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
    await updateStateAndPersist(prev => ({ ...prev, name: name.trim() || 'Bitcoiner' }));
  };

  return (
    <GameContext.Provider
      value={{
        userState,
        isLoading,
        completeLesson,
        spinWheel,
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
