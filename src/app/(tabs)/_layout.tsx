import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { BitcoinColors } from '@/constants/theme';
import { useGame } from '@/context/GameContext';

export default function TabLayout() {
  const { userState } = useGame();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: BitcoinColors.surface,
          borderTopColor: BitcoinColors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
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
        name="tools"
        options={{
          title: 'Ecossistema',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'grid' : 'grid-outline'} size={22} color={String(color)} />
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
