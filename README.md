# SatoQuest ⚡🎮
> **Aplicativo Educativo e Gamificado sobre a Rede Bitcoin**
> Desenvolvido em **React Native** com **Expo** e **TypeScript** para atender aos objetivos da **Atividade Extensionista III: Tecnologia Aplicada à Inclusão Digital (UNINTER)**.

---

## 🎯 Objetivos Atendidos (Alinhamento UNINTER)

- **Ensinar os fundamentos da rede Bitcoin:** 4 módulos progressivos com conceitos claros, analogias didáticas e quizzes de fixação interativos com explicações para cada resposta.
- **Gamificar o ensino da rede Bitcoin:** Sistema estilo Duolingo com níveis, streaks, XP, galeria de conquistas (Badges) e a **Roleta dos Satoshis (Lucky Wheel)** para sortear recompensas em satoshinhos.
- **Incentivar o uso de ferramentas do ecossistema:** Aba dedicada **"Ecossistema"** com ferramentas reais (Mempool.space, BlueWallet, Muun, Phoenix, Sparrow, Bisq, BTCPay Server) com links e guias práticos de por que e como utilizá-las.
- **Desenvolver em React Native:** Desenvolvido com React Native, Expo Router, tema Bitcoin Dark Mode e arquitetura 100% offline-first via AsyncStorage.

---

## 🚀 Como Executar o Aplicativo

### Pré-requisitos
- Node.js (>= 18) ou Bun instalado.
- Celular com o app **Expo Go** (disponível na Google Play e App Store) ou navegador web.

### 1. Iniciar o servidor de desenvolvimento:
```bash
cd /home/hayek/Documents/projects/satoquest

# Com Bun:
bun start

# Ou com npm / npx:
npx expo start
```

### 2. Abrir no Celular ou Navegador:
- **No Celular:** Escaneie o QR Code exibido no terminal com o app **Expo Go** (no Android) ou com a câmera (no iOS).
- **No Navegador (Web):** Pressione `w` no terminal ou execute `bun run web`.

---

## 📱 Estrutura do Aplicativo

### Abas Principais (Tabs)
1. **Aprender (`/`)**: Trilhas modulares progressivas com status de conclusão e porcentagem de progresso.
2. **Roleta (`/wheel`)**: Roleta da sorte animada com prêmios de 21, 50, 100, 210, 500 e 1000 satoshinhos, com feedback sonoro/háptico e celebração.
3. **Carteira (`/wallet`)**: Exibição do saldo acumulado em satoshis (com valor aproximado em BTC e BRL), extrato de transações e o **Simulador de Saque** (Lightning vs. On-chain) que gera comprovante e hash TXID autêntico.
4. **Ecossistema (`/tools`)**: Hub prático com filtros por categoria (Explorer, Carteira, Lightning, Privacidade, Hardware).
5. **Perfil (`/profile`)**: Indicadores de nível, barra de XP, streak de dias de estudo e galeria de badges conquistadas.

### Módulos de Ensino (`src/constants/curriculum.ts`)
- **Módulo 1: O Dinheiro & Origem do Bitcoin**
  - Lição 1: O Que é Dinheiro?
  - Lição 2: O Nascimento do Bitcoin (Satoshi Nakamoto, 2008 e o Bloco Gênese)
  - Lição 3: A Regra dos 21 Milhões e os Satoshis
- **Módulo 2: Blockchain, Blocos & Mineração**
  - Lição 1: O Livro-Razão Distribuído e Nós (Nodes)
  - Lição 2: Blocos e a Prova de Trabalho (Proof of Work & SHA-256)
  - Lição 3: O Halving e o Ajuste de Dificuldade
- **Módulo 3: Carteiras, Chaves Privadas & Segurança**
  - Lição 1: Chaves Públicas e Privadas (A Caixa de Correio)
  - Lição 2: A Sagrada Seed Phrase (12/24 Palavras BIP-39)
  - Lição 3: Not Your Keys, Not Your Coins (Autocustódia vs Corretoras)
- **Módulo 4: Lightning Network & Ferramentas do Ecossistema**
  - Lição 1: O Desafio da Escalabilidade (Camada 1 vs Camada 2)
  - Lição 2: Como Usar a Lightning Network (Invoices e Liquidação Instantânea)
  - Lição 3: Ferramentas do Ecossistema na Prática

---

## 🛠️ Tecnologias e Bibliotecas
- **React Native 0.88** & **Expo SDK 58**
- **Expo Router** (Roteamento baseado em arquivos com Tabs e Stack Modals)
- **TypeScript** (Tipagem estrita e zero erros de compilação)
- **@react-native-async-storage/async-storage** (Persistência local offline-first)
- **@expo/vector-icons** (Ionicons para iconografia nativa)
- **expo-haptics** (Feedback tátil nos botões, quizzes e roleta)
