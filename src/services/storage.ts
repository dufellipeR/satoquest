import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserState } from '@/types';

const STORAGE_KEY = '@satoquest_user_state_v1';

export const INITIAL_USER_STATE: UserState = {
  name: 'Aventureiro Bitcoin',
  xp: 0,
  level: 1,
  satsBalance: 50,
  diceRollsAvailable: 1,
  streakDays: 1,
  completedLessonIds: [],
  unlockedBadgeIds: [],
  transactions: [
    {
      id: 'tx-welcome',
      type: 'reward',
      amount: 50,
      description: 'Bônus de Boas-Vindas ao SatoQuest 🚀',
      timestamp: Date.now(),
      status: 'confirmed',
    },
  ],
  lastActiveDate: new Date().toISOString().slice(0, 10),
};

export const loadStoredUserState = async (): Promise<UserState> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_USER_STATE;
    const parsed = JSON.parse(raw);
    
    // Migrate legacy spinsAvailable to diceRollsAvailable if needed
    const diceRolls = parsed.diceRollsAvailable ?? parsed.spinsAvailable ?? 1;

    return {
      ...INITIAL_USER_STATE,
      ...parsed,
      diceRollsAvailable: diceRolls,
    };
  } catch (error) {
    console.warn('Erro ao carregar estado salvo, utilizando estado padrão:', error);
    return INITIAL_USER_STATE;
  }
};

export const saveStoredUserState = async (state: UserState): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Erro ao salvar estado no AsyncStorage:', error);
  }
};
