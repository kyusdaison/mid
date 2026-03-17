import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../store/walletStore';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const mono = Platform.select({ web: '"IBM Plex Mono", monospace', default: Platform.OS === 'ios' ? 'Menlo' : 'monospace' });

export default function TransactionHistoryScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const transactions = useWalletStore((state) => state.transactions);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={['rgba(77, 124, 254, 0.05)', '#04060A']} style={StyleSheet.absoluteFillObject} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#D4D8E0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SECURE LEDGER</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="filter" size={18} color="#8A8A8E" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {transactions.map((tx) => {
          const isReceived = tx.type === 'RECEIVED';
          const isSent = tx.type === 'SENT';
          const iconColor = isReceived ? '#47C778' : isSent ? '#4D7CFE' : '#7E8BA0';
          const bgColor = isReceived ? 'rgba(71, 199, 120, 0.15)' : isSent ? 'rgba(77, 124, 254, 0.15)' : 'rgba(255,255,255,0.05)';
          const iconName = isReceived ? 'arrow-down' : isSent ? 'arrow-up' : 'lock-closed';

          return (
            <BlurView intensity={24} tint="dark" style={styles.txCard} key={tx.id}>
               <LinearGradient
                  colors={['rgba(255,255,255,0.03)', 'rgba(0,0,0,0)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                />
              <View style={styles.txRow}>
                <View style={[styles.txIconBox, { backgroundColor: bgColor }]}>
                  <Ionicons name={iconName} size={16} color={iconColor} />
                </View>
                <View style={styles.txDetails}>
                  <Text style={styles.txType}>{tx.type}</Text>
                  <Text style={styles.txEntity}>{tx.from || tx.to || tx.contract}</Text>
                </View>
                <View style={styles.txAmounts}>
                  <Text style={[styles.txAmount, { color: isReceived ? '#47C778' : '#F4F7FB' }]}>
                    {isReceived ? '+' : isSent ? '-' : ''}{tx.amount}
                  </Text>
                  <View style={[styles.statusBadge, { borderColor: isReceived ? 'rgba(71, 199, 120, 0.3)' : 'rgba(77, 124, 254, 0.3)' }]}>
                    <Text style={[styles.txStatus, { color: isReceived ? '#47C778' : '#4D7CFE' }]}>{tx.status}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.txFooter}>
                <Text style={styles.txDate}>{tx.date}</Text>
                <View style={styles.hashBox}>
                  <Ionicons name="link" size={12} color="#4D7CFE" style={{ marginRight: 4 }} />
                  <Text style={styles.txHash}>0xfc...{tx.id.substring(0, 6)}</Text>
                </View>
              </View>
            </BlurView>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#04060A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backBtn: {
    padding: 5,
  },
  filterBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#D4D8E0',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    fontFamily: mono,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  txCard: {
    backgroundColor: 'rgba(10, 15, 23, 0.6)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(77, 124, 254, 0.15)',
    overflow: 'hidden',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  txIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  txDetails: {
    flex: 1,
  },
  txType: {
    color: '#F4F7FB',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  txEntity: {
    color: '#7E8BA0',
    fontSize: 13,
  },
  txAmounts: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: mono,
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  txStatus: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  txFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 14,
  },
  txDate: {
    color: '#7E8BA0',
    fontSize: 12,
  },
  hashBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(77, 124, 254, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  txHash: {
    color: '#4D7CFE',
    fontSize: 12,
    fontFamily: mono,
  }
});
