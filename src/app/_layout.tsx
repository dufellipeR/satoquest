import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from '@/context/GameContext';
import { BitcoinColors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <GameProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: BitcoinColors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="lesson/[id]"
          options={{
            headerShown: false,
            presentation: 'fullScreenModal',
          }}
        />
      </Stack>
    </GameProvider>
  );
}
