import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { HeaderStats } from '@/components/HeaderStats';
import { WithdrawModal } from '@/components/WithdrawModal';
import { BitcoinColors } from '@/constants/theme';
import { useGame, triggerHaptic } from '@/context/GameContext';

export default function WalletScreen() {
  const { userState } = useGame();
  const [withdrawVisible, setWithdrawVisible] = useState(false);
  const [receiveVisible, setReceiveVisible] = useState(false);

  // Approximate conversions for educational perspective (e.g. 1 BTC ~ $90,000 USD ~ R$ 500,000)
  const btcValue = (userState.satsBalance / 100000000).toFixed(8);
  const brlEstimate = ((userState.satsBalance / 100000000) * 520000).toFixed(2);

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <HeaderStats />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Wallet Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.cardHeader}>
            <View style={styles.networkBadge}>
              <View style={styles.greenDot} />
              <Text style={styles.networkText}>Rede Bitcoin (Simulada)</Text>
            </View>
            <Ionicons name="shield-checkmark" size={18} color={BitcoinColors.success} />
          </View>

          <Text style={styles.balanceLabel}>Saldo Disponível</Text>
          <View style={styles.balanceRow}>
            <Ionicons name="logo-bitcoin" size={32} color={BitcoinColors.bitcoin} />
            <Text style={styles.balanceNumber}>{userState.satsBalance.toLocaleString('pt-BR')}</Text>
            <Text style={styles.satsUnit}>sats</Text>
          </View>

          <View style={styles.conversionRow}>
            <Text style={styles.conversionText}>{btcValue} BTC</Text>
            <Text style={styles.conversionDot}>•</Text>
            <Text style={styles.conversionText}>≈ R$ {brlEstimate}</Text>
          </View>

          {/* Action Buttons: Withdraw & Receive */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.withdrawBtn}
              onPress={() => {
                triggerHaptic('impact');
                setWithdrawVisible(true);
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
              <Text style={styles.withdrawBtnText}>Sacar / Enviar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.receiveBtn}
              onPress={() => {
                triggerHaptic('selection');
                setReceiveVisible(true);
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="arrow-down" size={18} color={BitcoinColors.bitcoin} />
              <Text style={styles.receiveBtnText}>Receber</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transactions Extrato */}
        <View style={styles.txHeaderRow}>
          <Text style={styles.txTitle}>Histórico de Transações</Text>
          <Text style={styles.txCount}>{userState.transactions.length} registros</Text>
        </View>

        {userState.transactions.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="receipt-outline" size={32} color={BitcoinColors.textMuted} />
            <Text style={styles.emptyText}>Nenhuma transação realizada ainda.</Text>
          </View>
        ) : (
          <View style={styles.txList}>
            {userState.transactions.map(tx => {
              const isReward = tx.type === 'reward';
              const dateStr = new Date(tx.timestamp).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <View key={tx.id} style={styles.txItem}>
                  <View
                    style={[
                      styles.txIconBox,
                      { backgroundColor: isReward ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)' },
                    ]}
                  >
                    <Ionicons
                      name={isReward ? 'arrow-down' : 'arrow-up'}
                      size={18}
                      color={isReward ? BitcoinColors.success : BitcoinColors.error}
                    />
                  </View>

                  <View style={styles.txInfo}>
                    <Text style={styles.txDesc}>{tx.description}</Text>
                    <Text style={styles.txDate}>{dateStr}</Text>
                    {tx.txHash && (
                      <Text style={styles.txHashPreview} numberOfLines={1}>
                        TX: {tx.txHash.slice(0, 16)}...
                      </Text>
                    )}
                  </View>

                  <View style={styles.txAmountGroup}>
                    <Text
                      style={[
                        styles.txAmount,
                        { color: isReward ? BitcoinColors.success : BitcoinColors.error },
                      ]}
                    >
                      {isReward ? `+${tx.amount}` : `-${tx.amount}`} sats
                    </Text>
                    <Text style={styles.txStatus}>Confirmada</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Withdraw Modal Component */}
      <WithdrawModal visible={withdrawVisible} onClose={() => setWithdrawVisible(false)} />

      {/* Receive Modal */}
      <Modal visible={receiveVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.receiveModalContent}>
            <View style={styles.receiveHeader}>
              <Text style={styles.receiveTitle}>Receber Satoshis</Text>
              <TouchableOpacity onPress={() => setReceiveVisible(false)}>
                <Ionicons name="close" size={24} color={BitcoinColors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.qrPlaceholder}>
              <Ionicons name="qr-code" size={130} color="#FFFFFF" />
            </View>

            <Text style={styles.receiveAddressLabel}>Seu Endereço Simulado:</Text>
            <Text style={styles.receiveAddressText}>
              bc1q8f7k3m9s2satoquestuninter2026demo...
            </Text>

            <View style={styles.receiveTipBox}>
              <Ionicons name="bulb-outline" size={16} color={BitcoinColors.bitcoinGold} />
              <Text style={styles.receiveTipText}>
                No mundo real, você pode exibir esse QR Code para qualquer pessoa escanear e lhe transferir satoshis instantaneamente!
              </Text>
            </View>

            <TouchableOpacity
              style={styles.closeReceiveBtn}
              onPress={() => setReceiveVisible(false)}
            >
              <Text style={styles.closeReceiveBtnText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BitcoinColors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  balanceCard: {
    backgroundColor: BitcoinColors.surface,
    borderRadius: 24,
    padding: 22,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: BitcoinColors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BitcoinColors.success,
  },
  networkText: {
    color: BitcoinColors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  balanceLabel: {
    color: BitcoinColors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 6,
  },
  balanceNumber: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
  },
  satsUnit: {
    color: BitcoinColors.bitcoin,
    fontSize: 18,
    fontWeight: '800',
  },
  conversionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  conversionText: {
    color: BitcoinColors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  conversionDot: {
    color: BitcoinColors.textMuted,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  withdrawBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BitcoinColors.bitcoin,
    paddingVertical: 14,
    borderRadius: 14,
  },
  withdrawBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  receiveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BitcoinColors.surfaceElevated,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  receiveBtnText: {
    color: BitcoinColors.bitcoin,
    fontSize: 14,
    fontWeight: '800',
  },
  txHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  txTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  txCount: {
    color: BitcoinColors.textMuted,
    fontSize: 12,
  },
  emptyCard: {
    backgroundColor: BitcoinColors.surface,
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  emptyText: {
    color: BitcoinColors.textMuted,
    fontSize: 13,
  },
  txList: {
    gap: 10,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BitcoinColors.surface,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  txIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
  },
  txDesc: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  txDate: {
    color: BitcoinColors.textMuted,
    fontSize: 11,
  },
  txHashPreview: {
    color: BitcoinColors.textDim,
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  txAmountGroup: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  txStatus: {
    color: BitcoinColors.success,
    fontSize: 10,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  receiveModalContent: {
    backgroundColor: BitcoinColors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  receiveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  receiveTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  qrPlaceholder: {
    backgroundColor: BitcoinColors.surfaceElevated,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
    marginBottom: 16,
  },
  receiveAddressLabel: {
    color: BitcoinColors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  receiveAddressText: {
    color: BitcoinColors.bitcoin,
    fontSize: 12,
    fontFamily: 'monospace',
    backgroundColor: BitcoinColors.surfaceElevated,
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    marginBottom: 16,
    width: '100%',
  },
  receiveTipBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  receiveTipText: {
    color: BitcoinColors.bitcoinGold,
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  closeReceiveBtn: {
    backgroundColor: BitcoinColors.surfaceElevated,
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  closeReceiveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
