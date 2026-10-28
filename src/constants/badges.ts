import { Badge } from '@/types';

export const BADGES: Badge[] = [
  {
    id: 'badge-first-step',
    title: 'Primeiro Passo',
    description: 'Completou a sua primeiríssima lição no SatoQuest!',
    icon: 'footsteps-outline',
    category: 'curriculum',
  },
  {
    id: 'badge-module-1',
    title: 'Gênese Monetária',
    description: 'Dominou a evolução do dinheiro, inflação e a origem do Bitcoin com Satoshi Nakamoto.',
    icon: 'cash-outline',
    category: 'curriculum',
  },
  {
    id: 'badge-module-2',
    title: 'Mestre dos Blocos',
    description: 'Compreendeu como funciona a Blockchain, o Proof of Work e o relógio do Halving.',
    icon: 'cube-outline',
    category: 'curriculum',
  },
  {
    id: 'badge-module-3',
    title: 'Guardião da Seed',
    description: 'Aprendeu as regras de ouro da autocustódia e por que "Not your keys, not your coins".',
    icon: 'shield-checkmark-outline',
    category: 'curriculum',
  },
  {
    id: 'badge-module-4',
    title: 'Velocidade da Luz',
    description: 'Explorou a Lightning Network e as ferramentas essenciais do ecossistema.',
    icon: 'flash-outline',
    category: 'curriculum',
  },
  {
    id: 'badge-first-roll',
    title: 'Iniciativa D20',
    description: 'Rolou o Dado D20 de D&D pela primeira vez após uma lição!',
    icon: 'dice-outline',
    category: 'gamification',
  },
  {
    id: 'badge-nat-20',
    title: 'Vinte Natural! 🎲🔥',
    description: 'Rolou um 20 natural lendário no D20 e conquistou o Sucesso Crítico!',
    icon: 'flame-outline',
    category: 'gamification',
  },
  {
    id: 'badge-wealthy',
    title: 'Acumulador de Sats',
    description: 'Alcançou mais de 500 satoshinhos acumulados na sua carteira virtual.',
    icon: 'wallet-outline',
    category: 'wallet',
  },
  {
    id: 'badge-whale',
    title: 'Baleia de Satoshis',
    description: 'Acumulou mais de 1.500 satoshinhos através de estudos e rolagens críticas!',
    icon: 'trophy-outline',
    category: 'wallet',
  },
  {
    id: 'badge-withdrawal',
    title: 'Transação Soberana',
    description: 'Realizou uma simulação educativa de saque para uma invoice Lightning ou endereço On-chain.',
    icon: 'paper-plane-outline',
    category: 'wallet',
  },
];
