import { BitcoinColors } from '@/constants/theme';
import { triggerHaptic, useGame } from '@/context/GameContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface WithdrawModalProps {
  visible: boolean;
  onClose: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ visible, onClose }) => {
  const { userState, simulateWithdrawal } = useGame();

  const [method, setMethod] = useState<'lightning' | 'onchain'>('lightning');
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'form' | 'broadcasting' | 'receipt'>('form');
  const [txResult, setTxResult] = useState<{ txHash: string; amount: number; method: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const demoLightningInvoice = 'lnbc210u1pj8...sats_simulados_satoquest_demo_invoice';
  const demoOnchainAddress = 'bc1q9v8u4g...satoquest_demo_wallet_address_uninter';

  const handleFillDemo = () => {
    triggerHaptic('selection');
    if (method === 'lightning') {
      setDestination(demoLightningInvoice);
      setAmount('21');
    } else {
      setDestination(demoOnchainAddress);
      setAmount('100');
    }
  };

  const handleConfirm = async () => {
    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Por favor, informe uma quantidade válida de satoshis.');
      return;
    }
    if (numAmount > userState.satsBalance) {
      setErrorMessage(`Saldo insuficiente. Seu saldo é de ${userState.satsBalance} sats.`);
      return;
    }
    if (!destination.trim()) {
      setErrorMessage('Insira o endereço ou fatura de destino.');
      return;
    }

    setErrorMessage('');
    setStep('broadcasting');
    triggerHaptic('impact');

    // Simulate realistic broadcast delay
    setTimeout(async () => {
      const res = await simulateWithdrawal({
        method,
        destination,
        amountSats: numAmount,
        feeRate: method === 'lightning' ? 1 : 12,
      });

      if (res.success && res.txHash) {
        setTxResult({
          txHash: res.txHash,
          amount: numAmount,
          method,
        });
        setStep('receipt');
        triggerHaptic('success');
      } else {
        setErrorMessage(res.error || 'Erro na transação');
        setStep('form');
        triggerHaptic('warning');
      }
    }, 1800);
  };

  const handleResetAndClose = () => {
    setStep('form');
    setDestination('');
    setAmount('');
    setErrorMessage('');
    setTxResult(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons
                name={method === 'lightning' ? 'flash' : 'cube'}
                size={22}
                color={BitcoinColors.bitcoin}
              />
              <Text style={styles.headerTitle}>Simulador de Saque</Text>
            </View>
            <TouchableOpacity onPress={handleResetAndClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={BitcoinColors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            {step === 'form' && (
              <>
                {/* Method Tabs */}
                <View style={styles.methodSelector}>
                  <TouchableOpacity
                    style={[styles.methodTab, method === 'lightning' && styles.methodTabActive]}
                    onPress={() => {
                      triggerHaptic('selection');
                      setMethod('lightning');
                    }}
                  >
                    <Ionicons
                      name="flash"
                      size={16}
                      color={method === 'lightning' ? '#FFFFFF' : BitcoinColors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.methodTabText,
                        method === 'lightning' && styles.methodTabTextActive,
                      ]}
                    >
                      Lightning (Instantâneo)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.methodTab, method === 'onchain' && styles.methodTabActive]}
                    onPress={() => {
                      triggerHaptic('selection');
                      setMethod('onchain');
                    }}
                  >
                    <Ionicons
                      name="cube"
                      size={16}
                      color={method === 'onchain' ? '#FFFFFF' : BitcoinColors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.methodTabText,
                        method === 'onchain' && styles.methodTabTextActive,
                      ]}
                    >
                      On-Chain (Bloco)
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Educational Banner */}
                <View style={styles.eduBanner}>
                  <Ionicons name="information-circle-outline" size={18} color={BitcoinColors.bitcoin} />
                  <Text style={styles.eduBannerText}>
                    {method === 'lightning'
                      ? 'Na Lightning, os satoshis são liquidados em milissegundos com taxa simbólica de ~1 sat.'
                      : 'Na rede On-Chain, a transação entra na mempool e é minerada no próximo bloco (~10 min).'}
                  </Text>
                </View>

                {/* Destination Input */}
                <View style={styles.fieldGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.fieldLabel}>
                      {method === 'lightning' ? 'Fatura Lightning (Invoice)' : 'Endereço Bitcoin On-Chain'}
                    </Text>
                    <TouchableOpacity onPress={handleFillDemo}>
                      <Text style={styles.demoFillLink}>Preencher Demo</Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder={
                      method === 'lightning'
                        ? 'Ex: lnbc210u1pj8...'
                        : 'Ex: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
                    }
                    placeholderTextColor={BitcoinColors.textMuted}
                    value={destination}
                    onChangeText={setDestination}
                    autoCapitalize="none"
                  />
                </View>

                {/* Amount Input */}
                <View style={styles.fieldGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.fieldLabel}>Quantidade de Satoshis</Text>
                    <TouchableOpacity onPress={() => setAmount(String(userState.satsBalance))}>
                      <Text style={styles.demoFillLink}>Máx ({userState.satsBalance} sats)</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.amountInputRow}>
                    <TextInput
                      style={[styles.textInput, { flex: 1 }]}
                      placeholder="Ex: 50"
                      placeholderTextColor={BitcoinColors.textMuted}
                      value={amount}
                      onChangeText={setAmount}
                      keyboardType="numeric"
                    />
                    <View style={styles.satsUnitBadge}>
                      <Text style={styles.satsUnitText}>SATS</Text>
                    </View>
                  </View>
                </View>

                {/* Transaction Estimation Card */}
                <View style={styles.estimateCard}>
                  <View style={styles.estimateRow}>
                    <Text style={styles.estimateLabel}>Taxa Estimada da Rede</Text>
                    <Text style={styles.estimateValue}>
                      {method === 'lightning' ? '1 sat (0.0001%)' : '12 sats (Mempool Standard)'}
                    </Text>
                  </View>
                  <View style={styles.estimateRow}>
                    <Text style={styles.estimateLabel}>Tempo Estimado</Text>
                    <Text style={styles.estimateValue}>
                      {method === 'lightning' ? '⚡ Imediato (< 1s)' : '⛓️ ~10 a 20 minutos'}
                    </Text>
                  </View>
                  <View style={[styles.estimateRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.estimateLabel}>Status da Simulação</Text>
                    <Text style={[styles.estimateValue, { color: BitcoinColors.success }]}>
                      Rede Aberta & Ativa
                    </Text>
                  </View>
                </View>

                {errorMessage ? (
                  <View style={styles.errorBox}>
                    <Ionicons name="alert-circle" size={16} color={BitcoinColors.error} />
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                ) : null}

                {/* Submit Button */}
                <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                  <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
                  <Text style={styles.confirmBtnText}>Confirmar Envio Simulado</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 'broadcasting' && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={BitcoinColors.bitcoin} />
                <Text style={styles.loadingTitle}>Transmitindo para a Rede...</Text>
                <Text style={styles.loadingSubtitle}>
                  Comunicando com nós pares (P2P) e validando assinaturas criptográficas ECDSA/Schnorr.
                </Text>
              </View>
            )}

            {step === 'receipt' && txResult && (
              <View style={styles.receiptContainer}>
                <View style={styles.receiptIcon}>
                  <Ionicons name="checkmark-circle" size={60} color={BitcoinColors.success} />
                </View>

                <Text style={styles.receiptTitle}>Transação Transmitida!</Text>
                <Text style={styles.receiptSubtitle}>
                  {txResult.method === 'lightning'
                    ? 'Pagamento liquidado via Lightning Network ⚡'
                    : 'Transação propagada e aguardando confirmação no bloco ⛓️'}
                </Text>

                <View style={styles.receiptCard}>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Valor Enviado</Text>
                    <Text style={styles.receiptValueBold}>-{txResult.amount} SATS</Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Tipo de Envio</Text>
                    <Text style={styles.receiptValue}>
                      {txResult.method === 'lightning' ? 'Lightning Invoice' : 'On-Chain UTXO'}
                    </Text>
                  </View>
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>Status</Text>
                    <Text style={[styles.receiptValue, { color: BitcoinColors.success, fontWeight: '700' }]}>
                      Sucesso (Auditado)
                    </Text>
                  </View>
                  <View style={[styles.receiptRow, { flexDirection: 'column', alignItems: 'flex-start', gap: 4 }]}>
                    <Text style={styles.receiptLabel}>Hash da Transação (TXID)</Text>
                    <Text style={styles.receiptHash}>{txResult.txHash}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.confirmBtn} onPress={handleResetAndClose}>
                  <Text style={styles.confirmBtnText}> Concluir </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: BitcoinColors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: BitcoinColors.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: 20,
    paddingBottom: 40,
  },
  methodSelector: {
    flexDirection: 'row',
    backgroundColor: BitcoinColors.surfaceElevated,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  methodTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  methodTabActive: {
    backgroundColor: BitcoinColors.bitcoin,
  },
  methodTabText: {
    color: BitcoinColors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  methodTabTextActive: {
    color: '#FFFFFF',
  },
  eduBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(247, 147, 26, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(247, 147, 26, 0.25)',
  },
  eduBannerText: {
    color: BitcoinColors.bitcoinLight,
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
    fontWeight: '500',
  },
  fieldGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    color: BitcoinColors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  demoFillLink: {
    color: BitcoinColors.bitcoin,
    fontSize: 12,
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: BitcoinColors.surfaceElevated,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  satsUnitBadge: {
    backgroundColor: BitcoinColors.surfaceElevated,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  satsUnitText: {
    color: BitcoinColors.bitcoin,
    fontWeight: '900',
    fontSize: 13,
  },
  estimateCard: {
    backgroundColor: BitcoinColors.surfaceElevated,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  estimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  estimateLabel: {
    color: BitcoinColors.textMuted,
    fontSize: 12,
  },
  estimateValue: {
    color: BitcoinColors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    color: BitcoinColors.error,
    fontSize: 12,
    flex: 1,
    fontWeight: '600',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BitcoinColors.bitcoin,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 14,
  },
  loadingTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  loadingSubtitle: {
    color: BitcoinColors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  receiptContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  receiptIcon: {
    marginBottom: 12,
  },
  receiptTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  receiptSubtitle: {
    color: BitcoinColors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 20,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: BitcoinColors.surfaceElevated,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
    marginBottom: 24,
    gap: 12,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    color: BitcoinColors.textSecondary,
    fontSize: 12,
  },
  receiptValue: {
    color: BitcoinColors.text,
    fontSize: 13,
  },
  receiptValueBold: {
    color: BitcoinColors.bitcoin,
    fontSize: 18,
    fontWeight: '900',
  },
  receiptHash: {
    color: BitcoinColors.textMuted,
    fontSize: 11,
    fontFamily: 'monospace',
    backgroundColor: BitcoinColors.surface,
    padding: 8,
    borderRadius: 8,
    width: '100%',
  },
});
