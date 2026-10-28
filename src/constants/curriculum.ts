import { Module } from '@/types';

export const MODULES: Module[] = [
  {
    id: 'module-1',
    number: 1,
    title: 'O Dinheiro & Origem do Bitcoin',
    subtitle: 'Por que o Bitcoin foi criado e o que torna o dinheiro sólido',
    description: 'Compreenda a evolução histórica do dinheiro, os perigos da inflação descontrolada e como Satoshi Nakamoto propôs a primeira moeda digital escassa do mundo.',
    icon: 'cash-outline',
    color: '#F7931A',
    badgeId: 'badge-module-1',
    lessons: [
      {
        id: 'lesson-1-1',
        moduleId: 'module-1',
        title: 'O Que é Dinheiro?',
        subtitle: 'Do escambo ao padrão ouro e o papel fiduciário',
        durationMin: 4,
        xpReward: 50,
        steps: [
          {
            id: 'step-1',
            title: 'O Problema do Escambo',
            explanation: 'Na antiguidade, antes do dinheiro, as pessoas usavam a troca direta (escambo). Se você tivesse maçãs e precisasse de sapatos, tinha que encontrar um sapateiro que quisesse maçãs naquele exato momento. Isso é a "coincidência de desejos", algo muito raro e ineficiente.',
            keyTakeaway: 'O dinheiro surgiu naturalmente para resolver o problema da troca direta.',
            practicalTip: 'Pense no dinheiro como uma tecnologia de cooperação humana.'
          },
          {
            id: 'step-2',
            title: 'As 3 Propriedades do Bom Dinheiro',
            explanation: 'Para algo funcionar bem como dinheiro, precisa atender a 3 funções fundamentais: (1) Meio de Troca (aceito por todos), (2) Unidade de Conta (para precificar bens) e (3) Reserva de Valor (manter seu poder de compra através do tempo).',
            keyTakeaway: 'O ouro dominou por milênios porque era escasso, divisível, durável e infalsificável.',
            practicalTip: 'Se um bem perde valor rápido com o tempo, ele falha como reserva de valor.'
          },
          {
            id: 'step-3',
            title: 'A Queda do Padrão Ouro e a Inflação',
            explanation: 'Em 1971, o presidente dos EUA Richard Nixon rompeu o último vínculo entre o dólar e o ouro. Desde então, governos imprimem moedas fiduciárias sem lastro. Quando governos imprimem dinheiro do nada, diluem o poder de compra de quem trabalha e poupa: isso é a inflação.',
            keyTakeaway: 'Moedas emitidas por governos têm oferta infinita sujeita à decisão política.',
            practicalTip: 'O Bitcoin foi desenhado para ser o ouro digital: escasso e imutável.'
          }
        ],
        quiz: [
          {
            id: 'q1-1',
            question: 'Qual das opções abaixo descreve as 3 propriedades fundamentais do dinheiro?',
            hint: 'Pense em como usamos a moeda no dia a dia e para o futuro.',
            options: [
              {
                id: 'opt1',
                text: 'Meio de troca, unidade de conta e reserva de valor',
                isCorrect: true,
                explanation: 'Exato! Um bom dinheiro precisa permitir trocas fáceis, precificar produtos e preservar riqueza no tempo.'
              },
              {
                id: 'opt2',
                text: 'Ser digital, ter juros altos e aprovação governamental',
                isCorrect: false,
                explanation: 'Incorreto. O ouro, por exemplo, nunca teve juros e não é digital, mas funcionou como dinheiro por milênios.'
              },
              {
                id: 'opt3',
                text: 'Ser emitido por um banco central com validade de expiração',
                isCorrect: false,
                explanation: 'Incorreto. Validade de expiração destrói a função de reserva de valor.'
              }
            ]
          },
          {
            id: 'q1-2',
            question: 'Por que o ouro foi o padrão monetário por séculos antes das moedas modernas?',
            hint: 'Pense no custo para produzir ouro.',
            options: [
              {
                id: 'opt1',
                text: 'Porque era escasso, durável e impossível de ser criado do nada',
                isCorrect: true,
                explanation: 'Perfeito! A dificuldade e custo de extrair ouro (escassez natural) impediam governantes de multiplicá-lo facilmente.'
              },
              {
                id: 'opt2',
                text: 'Porque era leve e fácil de transportar pelo correio',
                isCorrect: false,
                explanation: 'Na verdade, o ouro é muito pesado e difícil de transportar com segurança em longas distâncias.'
              },
              {
                id: 'opt3',
                text: 'Porque os governos o inventaram para cobrar impostos',
                isCorrect: false,
                explanation: 'O ouro foi escolhido pelo mercado livre muito antes da existência de bancos centrais modernos.'
              }
            ]
          }
        ]
      },
      {
        id: 'lesson-1-2',
        moduleId: 'module-1',
        title: 'O Nascimento do Bitcoin',
        subtitle: 'Satoshi Nakamoto, 2008 e o Bloco Gênese',
        durationMin: 5,
        xpReward: 60,
        steps: [
          {
            id: 'step-1',
            title: 'A Crise Financeira de 2008',
            explanation: 'Em 2008, o sistema bancário global entrou em colapso devido a hipotecas fraudulentas e endividamento excessivo. Bancos centrais resgataram mega-bancos falidos com trilhões de dólares do contribuinte, acelerando a dívida e desvalorizando o dinheiro da população.',
            keyTakeaway: 'A dependência de intermediários financeiros centralizados provou ser o elo fraco da economia.',
            practicalTip: 'O Bitcoin nasceu como resposta direta à irresponsabilidade dos bancos centrais.'
          },
          {
            id: 'step-2',
            title: 'O Whitepaper de Satoshi Nakamoto',
            explanation: 'Em 31 de outubro de 2008, sob o pseudônimo Satoshi Nakamoto, foi publicado um artigo de 9 páginas intitulado "Bitcoin: Um Sistema de Dinheiro Eletrônico Ponto a Ponto (Peer-to-Peer)". A proposta: transferir valor na internet sem depender de nenhum banco.',
            keyTakeaway: 'Peer-to-Peer significa negociar de pessoa para pessoa, sem terceiros de confiança.',
            practicalTip: 'Qualquer pessoa pode ler o whitepaper original gratuitamente.'
          },
          {
            id: 'step-3',
            title: 'O Bloco Gênese (Bloco 0)',
            explanation: 'Em 3 de janeiro de 2009, Satoshi minerou o primeiro bloco do Bitcoin. Nele, eternizou a manchete do jornal The Times: "Chancellor on brink of second bailout for banks" (Chanceler à beira do segundo resgate a bancos). Um lembrete eterno do porquê da criação do Bitcoin.',
            keyTakeaway: 'O Bloco Gênese carrega o manifesto histórico contra o resgate a bancos privados.',
            practicalTip: 'O Bitcoin funciona ininterruptamente desde 3 de janeiro de 2009 sem interrupção.'
          }
        ],
        quiz: [
          {
            id: 'q2-1',
            question: 'O que significa um sistema "Peer-to-Peer" (Ponto a Ponto)?',
            hint: 'Pense em como duas pessoas trocam uma nota de dinheiro em mãos.',
            options: [
              {
                id: 'opt1',
                text: 'Transferência direta entre duas partes, sem necessidade de intermediários ou bancos',
                isCorrect: true,
                explanation: 'Correto! Assim como passar uma cédula na mão de alguém, o Bitcoin permite enviar valor digitalmente sem pedir autorização a ninguém.'
              },
              {
                id: 'opt2',
                text: 'Um sistema regulado pela ONU e auditado por corporações de tecnologia',
                isCorrect: false,
                explanation: 'Não. P2P é descentralizado e não envolve autoridade corporativa ou governamental.'
              },
              {
                id: 'opt3',
                text: 'Uma rede em que todos os dados são centralizados num único servidor mestre',
                isCorrect: false,
                explanation: 'Isso é o oposto: redes P2P distribuem os dados por todos os nós participantes.'
              }
            ]
          },
          {
            id: 'q2-2',
            question: 'Qual mensagem histórica Satoshi Nakamoto gravou no primeiro bloco (Bloco Gênese)?',
            hint: 'Tratava-se de um artigo sobre o resgate aos bancos no Reino Unido.',
            options: [
              {
                id: 'opt1',
                text: 'A manchete do jornal The Times sobre o resgate bancário aos bancos',
                isCorrect: true,
                explanation: 'Isso mesmo! Serviu como prova da data de início e protesto contra a farra dos resgates financeiros.'
              },
              {
                id: 'opt2',
                text: 'A senha de sua chave privada para futuros desenvolvedores',
                isCorrect: false,
                explanation: 'Nunca se coloca chaves privadas em dados públicos!'
              },
              {
                id: 'opt3',
                text: 'Uma mensagem prevendo o preço do Bitcoin em dólares',
                isCorrect: false,
                explanation: 'Satoshi focava em construir dinheiro sólido e seguro, não em especulação de preço.'
              }
            ]
          }
        ]
      },
      {
        id: 'lesson-1-3',
        moduleId: 'module-1',
        title: 'A Regra dos 21 Milhões',
        subtitle: 'Escassez absoluta e a divisão em satoshis',
        durationMin: 4,
        xpReward: 50,
        steps: [
          {
            id: 'step-1',
            title: 'Escassez Digital Matemática',
            explanation: 'Pela primeira vez na história da humanidade, foi criado algo 100% digital que não pode ser copiado ou inflacionado. O código-fonte do Bitcoin estabelece um limite estrito: jamais existirão mais de 21.000.000 de bitcoins.',
            keyTakeaway: 'Ao contrário do Real ou Dólar, ninguém no mundo pode alterar o teto de 21 milhões.',
            practicalTip: 'Seja rico ou humilde, as regras matemáticas são as mesmas para todos.'
          },
          {
            id: 'step-2',
            title: 'O Que é um Satoshi?',
            explanation: 'Cada 1 Bitcoin é composto por 100 milhões de unidades menores, chamadas "Satoshis" (ou simplesmente sats). Portanto, você não precisa comprar 1 bitcoin inteiro; pode transacionar frações minúsculas (10 sats, 1.000 sats, etc.).',
            keyTakeaway: '1 Bitcoin = 100.000.000 Satoshis. Isso permite micropagamentos acessíveis a todos.',
            practicalTip: 'Neste aplicativo, você acumula satoshinhos conforme estuda!'
          },
          {
            id: 'step-3',
            title: 'Inclusão Financeira Global',
            explanation: 'Bilhões de pessoas no mundo não têm conta em banco (desbancarizadas), mas têm um smartphone. Com Bitcoin, qualquer pessoa com conexão à internet tem acesso imediato ao sistema financeiro mundial, sem aprovação de crédito ou burocracia.',
            keyTakeaway: 'O Bitcoin é um instrumento poderoso de inclusão digital e soberania econômica.',
            practicalTip: 'Não há discriminação de fronteira, gênero, nacionalidade ou renda na rede Bitcoin.'
          }
        ],
        quiz: [
          {
            id: 'q3-1',
            question: 'Quantos satoshis existem em 1 Bitcoin inteiro?',
            hint: 'Pense em 100 milhões.',
            options: [
              {
                id: 'opt1',
                text: '100.000.000 (cem milhões)',
                isCorrect: true,
                explanation: 'Exatamente! Essa divisibilidade permite que o Bitcoin seja utilizado tanto para compras milionárias quanto para pagar um cafezinho.'
              },
              {
                id: 'opt2',
                text: '1.000 (mil)',
                isCorrect: false,
                explanation: 'Não, 1.000 seria pouco para permitir micropagamentos globais.'
              },
              {
                id: 'opt3',
                text: '21.000.000 (vinte e um milhões)',
                isCorrect: false,
                explanation: '21 milhões é a quantidade máxima total de Bitcoins que existirão no mundo!'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'module-2',
    number: 2,
    title: 'Blockchain, Blocos & Mineração',
    subtitle: 'Como a rede funciona tecnicamente sem nenhum chefe',
    description: 'Entenda como o livro-razão distribuído, a criptografia SHA-256 e a Prova de Trabalho (Proof of Work) garantem a segurança de bilhões de dólares sem um servidor central.',
    icon: 'cube-outline',
    color: '#3B82F6',
    badgeId: 'badge-module-2',
    lessons: [
      {
        id: 'lesson-2-1',
        moduleId: 'module-2',
        title: 'O Livro-Razão Distribuído',
        subtitle: 'A rede de nós (Nodes) e a descentralização',
        durationMin: 5,
        xpReward: 60,
        steps: [
          {
            id: 'step-1',
            title: 'O Que é um Nó (Node)?',
            explanation: 'Um nó é um computador rodando o software do Bitcoin que mantém uma cópia completa de todas as transações feitas desde 2009. Existem dezenas de milhares de nós espalhados pelo planeta, em casas, escritórios e servidores.',
            keyTakeaway: 'Não existe um servidor central da empresa Bitcoin; a rede são os próprios usuários.',
            practicalTip: 'Qualquer pessoa com um computador simples pode rodar seu próprio nó em casa.'
          },
          {
            id: 'step-2',
            title: 'Verificação em Vez de Confiança',
            explanation: 'O lema do Bitcoin é: "Don\'t trust, verify" (Não confie, verifique). Quando alguém tenta enviar uma transação inválida (por exemplo, gastar moedas que não possui), cada nó da rede rejeita a fraude instantaneamente, sem precisar consultar ninguém.',
            keyTakeaway: 'Nenhum participante consegue burlar as regras porque todos os nós auditam tudo.',
            practicalTip: 'A descentralização impede que governos fechem o Bitcoin desligando um único servidor.'
          }
        ],
        quiz: [
          {
            id: 'q4-1',
            question: 'Qual o papel fundamental de um Nó (Node) na rede Bitcoin?',
            hint: 'Pense em quem fiscaliza se as regras do protocolo estão sendo seguidas.',
            options: [
              {
                id: 'opt1',
                text: 'Validar regras do protocolo e armazenar uma cópia do livro-razão histórico',
                isCorrect: true,
                explanation: 'Perfeito! Os nós são os fiscais independentes que garantem que ninguém quebre as regras.'
              },
              {
                id: 'opt2',
                text: 'Fixar o preço do Bitcoin nas corretoras e cobrar mensalidades',
                isCorrect: false,
                explanation: 'O protocolo Bitcoin não tem relação com o preço em corretoras e é 100% gratuito e aberto.'
              },
              {
                id: 'opt3',
                text: 'Armazenar as senhas e nomes reais de todos os donos de carteira',
                isCorrect: false,
                explanation: 'A rede Bitcoin não armazena nomes reais nem senhas, apenas endereços criptográficos e saldos.'
              }
            ]
          }
        ]
      },
      {
        id: 'lesson-2-2',
        moduleId: 'module-2',
        title: 'Blocos e a Prova de Trabalho',
        subtitle: 'Como o Proof of Work e o SHA-256 unem o mundo físico ao digital',
        durationMin: 5,
        xpReward: 60,
        steps: [
          {
            id: 'step-1',
            title: 'O Que é um Bloco?',
            explanation: 'Transações pendentes são agrupadas em "blocos". Cada bloco contém cerca de 2.000 a 4.000 transações e aponta matematicamente para o bloco anterior, formando uma corrente contínua: a Blockchain (corrente de blocos).',
            keyTakeaway: 'Alterar uma transação antiga exigiria refazer todo o trabalho computacional de todos os blocos posteriores.',
            practicalTip: 'Em média, um novo bloco é adicionado à rede a cada 10 minutos.'
          },
          {
            id: 'step-2',
            title: 'A Mineração e o Hash SHA-256',
            explanation: 'Mineradores competem globalmente resolvendo um quebra-cabeça criptográfico usando energia elétrica. O minerador precisa encontrar um número aleatório (nonce) que faça o resumo criptográfico (hash) do bloco começar com uma quantidade exigida de zeros.',
            keyTakeaway: 'A Prova de Trabalho consome energia real para tornar o histórico do Bitcoin matematicamente inviolável.',
            practicalTip: 'O minerador que encontra a solução recebe uma recompensa em novos bitcoins (subsídio de bloco) + taxas.'
          }
        ],
        quiz: [
          {
            id: 'q5-1',
            question: 'Por que é praticamente impossível alterar uma transação gravada no passado na blockchain do Bitcoin?',
            hint: 'Pense no gasto computacional necessário para reescrever todos os blocos seguintes.',
            options: [
              {
                id: 'opt1',
                text: 'Porque exigiria mais poder computacional e energia do que o resto do planeta inteiro somado',
                isCorrect: true,
                explanation: 'Exato! A Prova de Trabalho ancora a verdade histórica no mundo físico através do gasto de energia.'
              },
              {
                id: 'opt2',
                text: 'Porque Satoshi Nakamoto possui uma chave mestra que bloqueia edições',
                isCorrect: false,
                explanation: 'Não há chaves mestras nem administradores no Bitcoin.'
              },
              {
                id: 'opt3',
                text: 'Porque as transações são salvas em cartórios digitais centralizados',
                isCorrect: false,
                explanation: 'O Bitcoin elimina completamente a necessidade de cartórios intermediários.'
              }
            ]
          }
        ]
      },
      {
        id: 'lesson-2-3',
        moduleId: 'module-2',
        title: 'O Halving e o Ajuste de Dificuldade',
        subtitle: 'O relógio matemático que dita a emissão monetária',
        durationMin: 4,
        xpReward: 60,
        steps: [
          {
            id: 'step-1',
            title: 'O Halving: Corte da Inflação pela Metade',
            explanation: 'A cada 210.000 blocos minerados (aproximadamente 4 anos), a quantidade de novos bitcoins gerados por bloco é cortada pela metade. Começou em 50 BTC em 2009, caiu para 25, depois 12.5, 6.25 e 3.125 BTC em 2024.',
            keyTakeaway: 'Ao contrário das moedas estatais que aceleram a emissão, o Bitcoin torna-se cada vez mais escasso ao longo do tempo.',
            practicalTip: 'O último satoshi será minerado por volta do ano 2140.'
          },
          {
            id: 'step-2',
            title: 'O Ajuste de Dificuldade',
            explanation: 'Se mais mineradores entrarem na rede, os blocos seriam resolvidos muito rápido. Para evitar isso, a cada 2.016 blocos (~2 semanas), o protocolo ajusta a dificuldade matemática para garantir que a média continue em exatos 10 minutos por bloco.',
            keyTakeaway: 'O ajuste de dificuldade é a genialidade de Satoshi que mantém o Bitcoin autossuficiente e pontual.',
            practicalTip: 'É o único relógio monetário imutável da civilização.'
          }
        ],
        quiz: [
          {
            id: 'q6-1',
            question: 'O que acontece no evento conhecido como "Halving" do Bitcoin?',
            hint: 'A palavra deriva de "half" (metade em inglês).',
            options: [
              {
                id: 'opt1',
                text: 'A recompensa de novos bitcoins minerados por bloco é cortada pela metade a cada ~4 anos',
                isCorrect: true,
                explanation: 'Corretíssimo! Isso assegura a desinflação programada até atingir o teto de 21 milhões.'
              },
              {
                id: 'opt2',
                text: 'O saldo de todas as carteiras é reduzido em 50%',
                isCorrect: false,
                explanation: 'Jamais! O saldo dos usuários nunca é alterado por ninguém.'
              },
              {
                id: 'opt3',
                text: 'Metade dos computadores mineradores são desligados compulsoriamente',
                isCorrect: false,
                explanation: 'Qualquer um pode ligar ou desligar seu minerador quando desejar.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'module-3',
    number: 3,
    title: 'Carteiras, Chaves Privadas & Segurança',
    subtitle: 'A soberania financeira e a regra do "Not your keys, not your coins"',
    description: 'Aprenda como funciona a criptografia assimétrica, como guardar sua Seed Phrase com segurança máxima e por que deixar moedas em corretoras centralizadas é um risco.',
    icon: 'shield-checkmark-outline',
    color: '#10B981',
    badgeId: 'badge-module-3',
    lessons: [
      {
        id: 'lesson-3-1',
        moduleId: 'module-3',
        title: 'Chaves Públicas e Privadas',
        subtitle: 'A analogia da caixa de correio',
        durationMin: 5,
        xpReward: 60,
        steps: [
          {
            id: 'step-1',
            title: 'A Analogia da Caixa de Correio',
            explanation: 'Imagine uma caixa de correio na frente da sua casa: qualquer pessoa pode ver a fresta e depositar uma carta (isso é a sua Chave Pública / Endereço). Porém, apenas você possui a chave física que abre a portinha para retirar o conteúdo (sua Chave Privada).',
            keyTakeaway: 'Chave Pública = Compartilhe para receber satoshis. Chave Privada = Guarde em segredo absoluto.',
            practicalTip: 'Nunca, em hipótese alguma, envie sua chave privada para ninguém.'
          },
          {
            id: 'step-2',
            title: 'Onde Ficam os Bitcoins?',
            explanation: 'Os bitcoins NÃO ficam dentro do seu aplicativo de celular ou no pen-drive. Os bitcoins existem apenas na Blockchain! O seu aplicativo de carteira armazena apenas as CHAVES CRIPTOGRÁFICAS que autorizam a movimentação daquele saldo na rede.',
            keyTakeaway: 'Perder o celular não significa perder seus bitcoins, desde que você tenha guardado suas chaves!',
            practicalTip: 'Uma carteira é na verdade um chaveiro digital.'
          }
        ],
        quiz: [
          {
            id: 'q7-1',
            question: 'Se um amigo quiser lhe enviar satoshis, o que você deve fornecer a ele?',
            hint: 'Pense em qual chave serve para receber depósitos.',
            options: [
              {
                id: 'opt1',
                text: 'Seu Endereço / Chave Pública',
                isCorrect: true,
                explanation: 'Isso! Seu endereço público é seguro para compartilhar com qualquer remetente.'
              },
              {
                id: 'opt2',
                text: 'Sua Chave Privada de 24 palavras',
                isCorrect: false,
                explanation: 'PERIGO! Quem tem sua chave privada pode roubar todos os seus fundos instantaneamente.'
              },
              {
                id: 'opt3',
                text: 'Sua senha do e-mail pessoal',
                isCorrect: false,
                explanation: 'A rede Bitcoin não utiliza e-mails nem contas corporativas.'
              }
            ]
          }
        ]
      },
      {
        id: 'lesson-3-2',
        moduleId: 'module-3',
        title: 'A Sagrada Seed Phrase (12/24 Palavras)',
        subtitle: 'O padrão BIP-39 e regras de ouro da segurança',
        durationMin: 5,
        xpReward: 60,
        steps: [
          {
            id: 'step-1',
            title: 'O Que é a Seed Phrase?',
            explanation: 'Números criptográficos são gigantescos (como 256 zeros e uns). Para facilitar a vida dos seres humanos, o padrão BIP-39 traduz essa chave matemática em uma sequência de 12 ou 24 palavras em inglês simples (ex: "apple, river, mountain...").',
            keyTakeaway: 'Essa lista ordenada de palavras é a semente (seed) que recria todas as suas chaves e saldos.',
            practicalTip: 'A ordem das palavras importa tanto quanto as palavras em si.'
          },
          {
            id: 'step-2',
            title: 'As 4 Regras de Ouro da Seed Phrase',
            explanation: '1. NUNCA tire foto ou print da sua seed phrase.\n2. NUNCA digite suas palavras em computadores ou sites na internet.\n3. Anote à mão com caneta em papel grosso ou grave em placa de metal.\n4. Guarde em local seguro contra fogo, água e olhares curiosos.',
            keyTakeaway: 'Se o dispositivo quebrar, basta digitar as palavras em qualquer carteira para recuperar tudo.',
            practicalTip: 'Nenhum suporte oficial ou técnico legítimo jamais pedirá suas palavras de recuperação.'
          }
        ],
        quiz: [
          {
            id: 'q8-1',
            question: 'Qual é a forma correta e recomendada de fazer o backup da sua Seed Phrase?',
            hint: 'Pense em manter as palavras 100% offline e longe de hackers digitais.',
            options: [
              {
                id: 'opt1',
                text: 'Anotar em papel ou gravar em metal e guardar em local físico seguro e offline',
                isCorrect: true,
                explanation: 'Perfeito! Manter a seed offline é a única forma de garantir imunidade a vírus e vazamentos em nuvem.'
              },
              {
                id: 'opt2',
                text: 'Salvar uma foto no Google Fotos ou iCloud para não esquecer',
                isCorrect: false,
                explanation: 'Muitos investidores já foram roubados porque contas em nuvem foram invadidas ou vazadas.'
              },
              {
                id: 'opt3',
                text: 'Enviar as palavras pelo WhatsApp para um parente de confiança',
                isCorrect: false,
                explanation: 'Aplicativos de mensagens podem ser interceptados ou ter backups expostos.'
              }
            ]
          }
        ]
      },
      {
        id: 'lesson-3-3',
        moduleId: 'module-3',
        title: 'Not Your Keys, Not Your Coins',
        subtitle: 'Autocustódia vs. Corretoras Centralizadas (Exchanges)',
        durationMin: 4,
        xpReward: 50,
        steps: [
          {
            id: 'step-1',
            title: 'O Mito da Moeda na Corretora',
            explanation: 'Quando você compra Bitcoin em uma corretora (exchange) e deixa lá, você NÃO tem bitcoins; você tem apenas uma promessa de crédito daquela empresa. Se a corretora falir, for hackeada ou bloquear sua conta, seus fundos somem.',
            keyTakeaway: 'Casos históricos como Mt. Gox (2014) e FTX (2022) provaram o perigo de confiar cegamente em terceiros.',
            practicalTip: 'Corretora é lugar de negociar, não de guardar poupança.'
          },
          {
            id: 'step-2',
            title: 'A Verdadeira Soberania',
            explanation: 'Ter a autocustódia (guardar sua própria chave privada) significa ser seu próprio banco. Ninguém no universo pode congelar seus fundos, confiscar seu saldo ou censurar para onde você envia seu dinheiro.',
            keyTakeaway: 'Com grande soberania vem grande responsabilidade: a segurança depende apenas de você.',
            practicalTip: 'Comece com pequenos valores até dominar a criação de carteiras e backups.'
          }
        ],
        quiz: [
          {
            id: 'q9-1',
            question: 'O que o famoso lema "Not your keys, not your coins" significa no ecossistema Bitcoin?',
            hint: 'Quem detém a chave privada detém o dinheiro.',
            options: [
              {
                id: 'opt1',
                text: 'Se você não controla as chaves privadas da sua carteira, as moedas não são verdadeiramente suas',
                isCorrect: true,
                explanation: 'Exato! Se as chaves estão sob posse de uma corretora, você depende da boa vontade deles para sacar.'
              },
              {
                id: 'opt2',
                text: 'Que é obrigatório ter chaves de metal físicas para operar na rede',
                isCorrect: false,
                explanation: 'Chaves de metal são ótimas para segurança, mas o lema se refere ao controle criptográfico.'
              },
              {
                id: 'opt3',
                text: 'Que moedas digitais não podem ser compradas sem autorização de um banco',
                isCorrect: false,
                explanation: 'O Bitcoin é livre e sem permissão (permissionless).'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'module-4',
    number: 4,
    title: 'Lightning Network & Ferramentas do Ecossistema',
    subtitle: 'Escalabilidade global, transações instantâneas e ferramentas práticas',
    description: 'Explore a Lightning Network para micropagamentos em milissegundos e conheça ferramentas reais (Mempool.space, BlueWallet, Muun) que empoderam qualquer cidadão.',
    icon: 'flash-outline',
    color: '#A855F7',
    badgeId: 'badge-module-4',
    lessons: [
      {
        id: 'lesson-4-1',
        moduleId: 'module-4',
        title: 'O Desafio da Escalabilidade',
        subtitle: 'Por que a Camada 1 (on-chain) precisa da Camada 2 (Lightning)',
        durationMin: 5,
        xpReward: 60,
        steps: [
          {
            id: 'step-1',
            title: 'O Trilema das Blockchains',
            explanation: 'Na camada principal do Bitcoin (Camada 1), a prioridade absoluta é a DESCENTRALIZAÇÃO e a SEGURANÇA. Por isso, os blocos têm tamanho limitado (~2 a 4 MB) a cada 10 minutos, processando cerca de 7 transações por segundo.',
            keyTakeaway: 'Registrar a compra de um chiclete ou café na blockchain perpétua para sempre sobrecarregaria os nós.',
            practicalTip: 'A Camada 1 é a câmara de liquidação final; a Camada 2 é onde o comércio diário acontece.'
          },
          {
            id: 'step-2',
            title: 'A Analogia do Dinheiro Físico e da Conta de Bar',
            explanation: 'Imagine abrir uma comanda (aba) no bar: você consome várias bebidas ao longo da noite sem precisar passar o cartão a cada gole. No final da noite, você paga a conta de uma só vez e fecha a comanda. A Lightning Network funciona exatamente assim!',
            keyTakeaway: 'Apenas a abertura e o fechamento do canal tocam a blockchain principal.',
            practicalTip: 'Milhares de pagamentos podem ocorrer entre as partes instantaneamente com custo ínfimo.'
          }
        ],
        quiz: [
          {
            id: 'q10-1',
            question: 'Por que a Lightning Network (Camada 2) é essencial para o uso diário do Bitcoin?',
            hint: 'Pense em velocidade de confirmação e custo das taxas.',
            options: [
              {
                id: 'opt1',
                text: 'Permite milhões de transações instantâneas por segundo com taxas de fração de centavos',
                isCorrect: true,
                explanation: 'Perfeito! A Lightning resolve o gargalo de velocidade sem comprometer a segurança da rede principal.'
              },
              {
                id: 'opt2',
                text: 'Porque ela substitui o código do Bitcoin e altera o limite de 21 milhões',
                isCorrect: false,
                explanation: 'A Lightning não altera nenhuma regra básica do Bitcoin, é uma camada construída sobre ele.'
              },
              {
                id: 'opt3',
                text: 'Porque sem ela os mineradores não conseguiriam gastar energia',
                isCorrect: false,
                explanation: 'A mineração ocorre na Camada 1, independentemente da Lightning.'
              }
            ]
          }
        ]
      },
      {
        id: 'lesson-4-2',
        moduleId: 'module-4',
        title: 'Como Usar a Lightning Network',
        subtitle: 'Faturas (Invoices), QR Codes e liquidação em milissegundos',
        durationMin: 4,
        xpReward: 50,
        steps: [
          {
            id: 'step-1',
            title: 'O Que é uma Fatura (Lightning Invoice)?',
            explanation: 'Diferente de um endereço tradicional que pode ser reutilizado, uma fatura Lightning (começando geralmente por "lnbc...") é gerada especificamente para uma transação. Ela define o valor exato em satoshis e expira após alguns minutos.',
            keyTakeaway: 'Aponte a câmera para o QR Code da fatura, aperte enviar e o pagamento é liquidado em menos de 1 segundo.',
            practicalTip: 'Você pode testar faturas simuladas diretamente na aba Carteira deste app!'
          },
          {
            id: 'step-2',
            title: 'Pagamentos Ponto a Ponto sem Fronteiras',
            explanation: 'Pagar alguém no Japão, na Nigéria ou na padaria da sua esquina leva o mesmo tempo e tem o mesmo custo irrisório. Não há bancos intermediários, taxas de câmbio abusivas de remessa internacional nem risco de estorno fraudulento.',
            keyTakeaway: 'A Lightning torna o Bitcoin o dinheiro perfeito para a internet do futuro.',
            practicalTip: 'Aplicativos como BlueWallet, Phoenix e Muun trazem a Lightning para a ponta dos dedos.'
          }
        ],
        quiz: [
          {
            id: 'q11-1',
            question: 'Qual é a característica marcante de um pagamento feito via fatura Lightning?',
            hint: 'Pense no tempo de liquidação.',
            options: [
              {
                id: 'opt1',
                text: 'Confirmação quase instantânea em milissegundos com taxas irrisórias',
                isCorrect: true,
                explanation: 'Exato! É tão rápido quanto passar um cartão por aproximação ou PIX, mas 100% descentralizado e global.'
              },
              {
                id: 'opt2',
                text: 'Necessidade de aguardar 6 confirmações de blocos (60 minutos)',
                isCorrect: false,
                explanation: 'Isso é típico da Camada 1 em transações de grande valor, não da Lightning.'
              },
              {
                id: 'opt3',
                text: 'Exigência de aprovação manual pelo gerente do seu banco',
                isCorrect: false,
                explanation: 'Não há gerentes nem intermediários no Bitcoin.'
              }
            ]
          }
        ]
      },
      {
        id: 'lesson-4-3',
        moduleId: 'module-4',
        title: 'Ferramentas do Ecossistema na Prática',
        subtitle: 'Exploradores de blocos, carteiras abertas e inclusão digital',
        durationMin: 5,
        xpReward: 60,
        steps: [
          {
            id: 'step-1',
            title: 'O Poder da Mempool (mempool.space)',
            explanation: 'A Mempool é a "sala de espera" das transações que aguardam ser mineradas em um bloco. No site público e open-source mempool.space, você pode visualizar as taxas do momento (em sat/vB) para saber quanto pagar de taxa e ver os blocos chegando ao vivo.',
            keyTakeaway: 'Transparência radical: você tem acesso aos mesmos dados que os maiores mineradores do mundo.',
            practicalTip: 'Consulte a mempool antes de fazer transações grandes para economizar em taxas.'
          },
          {
            id: 'step-2',
            title: 'Incentivo à Inclusão Digital',
            explanation: 'Ferramentas do ecossistema como carteiras móveis não-custodiais (BlueWallet, Muun, Blink) capacitam comunidades carentes a receber doações, pagamentos por serviços freelancers e transferências familiares sem pagar taxas escorchantes de remessa.',
            keyTakeaway: 'O conhecimento dessas ferramentas cumpre diretamente o ODS 4 (Educação) e 8 (Trabalho Decente e Crescimento).',
            practicalTip: 'Visite a aba "Ferramentas" deste app para conhecer e explorar cada uma dessas aplicações!'
          }
        ],
        quiz: [
          {
            id: 'q12-1',
            question: 'Para que serve um explorador de blocos como o mempool.space?',
            hint: 'Pense em transparência e auditoria de transações.',
            options: [
              {
                id: 'opt1',
                text: 'Acompanhar blocos minerados, consultar taxas de rede e auditar transações públicas',
                isCorrect: true,
                explanation: 'Correto! É a janela aberta para qualquer pessoa no mundo auditar a contabilidade pública do Bitcoin.'
              },
              {
                id: 'opt2',
                text: 'Comprar bitcoins com desconto especial do governo',
                isCorrect: false,
                explanation: 'O mempool.space é apenas uma ferramenta analítica e visualizadora, não vende criptomoedas.'
              },
              {
                id: 'opt3',
                text: 'Resetar uma chave privada perdida pelo usuário',
                isCorrect: false,
                explanation: 'Ninguém pode resetar uma chave privada perdida na rede Bitcoin.'
              }
            ]
          }
        ]
      }
    ]
  }
];
