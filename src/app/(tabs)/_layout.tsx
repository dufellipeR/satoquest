import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BitcoinColors } from '@/constants/theme';
import { useGame } from '@/context/GameContext';

export default function TabLayout() {
  const { userState } = useGame();
  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === 'ios';

  // No Android a tab bar tinha altura fixa e ficava sob a barra de navegação do
  // sistema. Somamos o inset à base (em vez de trocar a base) para não encolher
  // o conteúdo da barra. No iOS os valores antigos já contemplavam o home
  // indicator, então ficam intactos.
  const tabBarHeight = (isIOS ? 88 : 68) + (isIOS ? 0 : insets.bottom);
  const tabBarPaddingBottom = isIOS ? 28 : insets.bottom + 10;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: BitcoinColors.surface,
          borderTopColor: BitcoinColors.border,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: tabBarPaddingBottom,
          paddingTop: 8,
        },
        tabBarActiveTintColor: BitcoinColors.bitcoin,
        tabBarInactiveTintColor: BitcoinColors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Aprender',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'school' : 'school-outline'} size={22} color={String(color)} />
          ),
        }}
      />

      <Tabs.Screen
        name="dice"
        options={{
          title: 'Dado D20',
          tabBarBadge: userState.diceRollsAvailable > 0 ? userState.diceRollsAvailable : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#FFD700',
            color: '#000000',
            fontSize: 10,
            fontWeight: '900',
          },
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'dice-d20' : 'dice-d20-outline'}
              size={24}
              color={String(color)}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Carteira',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'wallet' : 'wallet-outline'} size={22} color={String(color)} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'trophy' : 'trophy-outline'} size={22} color={String(color)} />
          ),
        }}
      />
    </Tabs>
  );
}
