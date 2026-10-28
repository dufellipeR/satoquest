# SatoQuest ⚡🎲
> **Aplicativo Mobile Gamificado sobre a Rede Bitcoin**
> Desenvolvido em **React Native** com **Expo** e **TypeScript** para atender integralmente aos objetivos da **Atividade Extensionista III: Tecnologia Aplicada à Inclusão Digital (UNINTER)**.

---

## 🎯 Objetivos Atendidos (Alinhamento UNINTER)

- **Ensinar os fundamentos da rede Bitcoin:** 4 módulos progressivos com conceitos claros, analogias didáticas e quizzes de fixação interativos com explicações para cada resposta.
- **Gamificar o ensino da rede Bitcoin:** Sistema RPG estilo D&D e Baldur's Gate 3 com níveis, streaks, bônus de proficiência, galeria de conquistas (Badges) e o **Dado do Destino (D20)** para sortear recompensas em satoshinhos.
- **Incentivar o uso de ferramentas do ecossistema:** Aba dedicada **"Ecossistema"** com ferramentas reais (Mempool.space, BlueWallet, Muun, Phoenix, Sparrow, Bisq, BTCPay Server) com links oficiais e guias práticos de uso.
- **Desenvolver em React Native:** Desenvolvido com React Native, Expo Router, tema Bitcoin Dark Mode e arquitetura 100% offline-first via AsyncStorage.

---

## 🚀 Como Executar o Aplicativo

### Pré-requisitos
- Node.js (>= 18) ou Bun instalado.
- Celular com o app **Expo Go** (disponível na Google Play e App Store) ou navegador web no computador.

### 1. Iniciar o servidor de desenvolvimento:

#### **Opção A: Conexão via Túnel (Recomendada para evitar problemas de rede/Docker):**
```bash
cd /home/hayek/Documents/projects/satoquest

# Com Bun:
bun run start:tunnel

# Ou com npx:
npx expo start --tunnel
```

#### **Opção B: Conexão direta via Rede Local (LAN):**
```bash
bun run start:lan
```

#### **Opção C: Abrir direto no Navegador do PC (Web):**
```bash
bun run web
```

### 2. Abrir no Celular:
- Escaneie o QR Code exibido no terminal com o app **Expo Go** (no Android) ou com a câmera padrão (no iOS).

---

## 📱 Estrutura do Aplicativo

### Abas Principais (Tabs)
1. **Aprender (`/`)**: Trilhas modulares progressivas com status de conclusão, lições e porcentagem de progresso geral.
2. **Dado D20 (`/dice`)**: Arena arcana de rolagem do dado de 20 faces (D&D / Baldur's Gate 3) com física de salto, haptics, soma de bônus de personagem e premiação em satoshinhos:
   - **20 Natural (Nat 20):** ⚔️ *Sucesso Crítico Lendário!* -> **1.000 satoshis** + aura dourada.
   - **Total 18+:** 🛡️ *Sucesso Superior!* -> **210 satoshis**.
   - **Total 12 a 17:** ⚡ *Sucesso Sólido!* -> **100 satoshis**.
   - **Total 2 a 11:** 🪙 *Sucesso Básico!* -> **50 satoshis**.
   - **1 Natural (Nat 1):** 🧙‍♂️ *Falha Crítica...* com consolação de **21 satoshis**.
3. **Carteira (`/wallet`)**: Exibição do saldo acumulado em satoshis (com valor de referência em BTC e BRL), extrato de transações e o **Simulador de Saque** (Lightning vs. On-chain) que gera comprovante com hash TXID autêntico de 64 caracteres.
4. **Ecossistema (`/tools`)**: Hub prático com filtros por categoria (Explorer, Carteira, Lightning, Privacidade, Hardware).
5. **Perfil (`/profile`)**: Indicadores de nível, barra de XP, streak de dias de estudo e galeria de badges conquistadas.

---

## 📚 Módulos de Ensino (`src/constants/curriculum.ts`)

- **Módulo 1: O Dinheiro & Origem do Bitcoin**
  - Lição 1: O Que é Dinheiro? (Escambo, padrão ouro e inflação fiduciária)
  - Lição 2: O Nascimento do Bitcoin (Satoshi Nakamoto, 2008 e o Bloco Gênese)
  - Lição 3: A Regra dos 21 Milhões e os Satoshis
- **Módulo 2: Blockchain, Blocos & Mineração**
  - Lição 1: O Livro-Razão Distribuído e Nós (Nodes)
  - Lição 2: Blocos e a Prova de Trabalho (Proof of Work & SHA-256)
  - Lição 3: O Halving e o Ajuste de Dificuldade
- **Módulo 3: Carteiras, Chaves Privadas & Segurança**
  - Lição 1: Chaves Públicas e Privadas (A Analogia da Caixa de Correio)
  - Lição 2: A Sagrada Seed Phrase (12/24 Palavras BIP-39 e regras de ouro)
  - Lição 3: Not Your Keys, Not Your Coins (Autocustódia vs Corretoras)
- **Módulo 4: Lightning Network & Ferramentas do Ecossistema**
  - Lição 1: O Desafio da Escalabilidade (Camada 1 vs Camada 2)
  - Lição 2: Como Usar a Lightning Network (Invoices e Liquidação Instantânea)
  - Lição 3: Ferramentas do Ecossistema na Prática (Mempool.space e Inclusão)

---

## 🛠️ Tecnologias e Bibliotecas
- **React Native 0.88** & **Expo SDK 58**
- **Expo Router** (Roteamento moderno baseado em arquivos com Tabs e Stack Modals)
- **TypeScript** (Tipagem estrita e zero erros de compilação)
- **@react-native-async-storage/async-storage** (Persistência local offline-first)
- **@expo/vector-icons** (MaterialCommunityIcons e Ionicons nativos)
- **expo-haptics** (Feedback tátil nas respostas do quiz e na rolagem do D20)
- **@expo/ngrok** (Suporte a túnel para testes em qualquer rede sem bloqueios de firewall)
