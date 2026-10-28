import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Para suportar renderização estática, o esquema de cor precisa ser recalculado
 * no cliente (web). Usamos useSyncExternalStore porque detectar a hidratação
 * com setState dentro de um efeito causa render em cascata — regra
 * react-hooks/set-state-in-effect.
 */
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useColorScheme() {
  const hasHydrated = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
