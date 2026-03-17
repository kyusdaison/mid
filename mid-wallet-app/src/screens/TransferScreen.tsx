import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../store/walletStore';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const mono = Platform.select({ web: '"IBM Plex Mono", monospace', default: Platform.OS === 'ios' ? 'Menlo' : 'monospace' });

export default function TransferScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { totalBalanceUsd, updateTotalBalance, addTransaction } = useWalletStore();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const formattedBalance = totalBalanceUsd.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });

  const handleTransfer = () => {
    const numAmount = Number(amount);
    if (!recipient || !amount) {
      Alert.alert('Invalid Input', 'Please enter a recipient and amount.');
      return;
    }
    if (numAmount > totalBalanceUsd) {
      Alert.alert('Insufficient Funds', 'Transfer amount exceeds available balance.');
      return;
    }
    
    const formattedNum = numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    addTransaction({
      id: Math.random().toString(36).substr(2, 9),
      type: 'SENT',
      amount: `- ${formattedNum} MID`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16).replace('-', '/').replace('-', '/'),
      status: 'CONFIRMED',
      to: recipient,
    });
    
    updateTotalBalance(totalBalanceUsd - numAmount);

    Alert.alert('Transfer Initiated', `Successfully sent ${amount} MID to ${recipient}`, [
      { text: 'OK', onPress: () => {
        setRecipient('');
        setAmount('');
        navigation.goBack();
      }}
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={['rgba(77, 124, 254, 0.05)', '#04060A']} style={StyleSheet.absoluteFillObject} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#D4D8E0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SECURE TRANSFER</Text>
        <TouchableOpacity style={styles.scanBtn}>
          <Ionicons name="scan-outline" size={20} color="#4D7CFE" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>RECIPIENT</Text>
        <BlurView intensity={24} tint="dark" style={styles.inputCard}>
           <LinearGradient
              colors={['rgba(255,255,255,0.03)', 'rgba(0,0,0,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
          <View style={styles.inputRow}>
            <View style={styles.iconBox}>
              <Ionicons name="person-outline" size={16} color="#7E8BA0" />
            </View>
            <TextInput 
              style={styles.input} 
              placeholder="@mon_citizen_id or 0x..."
              placeholderTextColor="#4A4A4F"
              autoCapitalize="none"
              value={recipient}
              onChangeText={setRecipient}
            />
            {recipient.length > 0 && (
              <Ionicons name="checkmark-circle" size={18} color="#47C778" style={styles.checkIcon} />
            )}
          </View>
        </BlurView>

        <View style={styles.amountLabelRow}>
          <Text style={styles.sectionLabel}>AMOUNT (MID)</Text>
          <View style={styles.availableBadge}>
            <Text style={styles.availableLabel}>Available:</Text>
            <Text style={styles.availableText}>${formattedBalance}</Text>
          </View>
        </View>

        <BlurView intensity={24} tint="dark" style={styles.inputCard}>
          <LinearGradient
              colors={['rgba(255,255,255,0.03)', 'rgba(0,0,0,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
          <View style={styles.amountInputRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput 
              style={styles.amountInput} 
              placeholder="0.00"
              placeholderTextColor="#2A303C"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
            <TouchableOpacity style={styles.maxBtn} onPress={() => setAmount(totalBalanceUsd.toString())}>
              <Text style={styles.maxBtnText}>MAX</Text>
            </TouchableOpacity>
          </View>
        </BlurView>

        <View style={styles.feeCard}>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Network Fee</Text>
            <Text style={styles.feeValue}>$0.00</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Estimated Time</Text>
            <Text style={styles.feeValue}>Instant</Text>
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.sendBtn, (!recipient || !amount) && styles.sendBtnDisabled]} onPress={handleTransfer} disabled={!recipient || !amount}>
          <Ionicons name="paper-plane-outline" size={18} color={(!recipient || !amount) ? "#4A4A4F" : "#0A0A0B"} style={{ marginRight: 8 }} />
          <Text style={[styles.sendBtnText, (!recipient || !amount) && styles.sendBtnTextDisabled]}>INITIATE TRANSFER</Text>
        </TouchableOpacity>
      </View>
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
  scanBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(77, 124, 254, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(77, 124, 254, 0.2)',
  },
  headerTitle: {
    color: '#D4D8E0',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    fontFamily: mono,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionLabel: {
    color: '#7E8BA0',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginTop: 20,
    fontFamily: mono,
  },
  inputCard: {
    backgroundColor: 'rgba(10, 15, 23, 0.6)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(77, 124, 254, 0.15)',
    overflow: 'hidden',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#F4F7FB',
    fontSize: 15,
    paddingVertical: 16,
    fontFamily: mono,
  },
  checkIcon: {
    marginLeft: 10,
  },
  amountLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 20,
    marginBottom: 12,
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(77, 124, 254, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(77, 124, 254, 0.2)',
  },
  availableLabel: {
    color: '#7E8BA0',
    fontSize: 10,
    marginRight: 4,
  },
  availableText: {
    color: '#4D7CFE',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: mono,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  currencySymbol: {
    color: '#7E8BA0',
    fontSize: 28,
    fontWeight: '700',
    marginRight: 8,
    marginTop: -4,
  },
  amountInput: {
    flex: 1,
    color: '#F4F7FB',
    fontSize: 40,
    fontWeight: '800',
    fontFamily: mono,
  },
  maxBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
  maxBtnText: {
    color: '#D4D8E0',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: mono,
  },
  feeCard: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  feeLabel: {
    color: '#7E8BA0',
    fontSize: 13,
  },
  feeValue: {
    color: '#D4D8E0',
    fontSize: 13,
    fontFamily: mono,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#04060A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  sendBtn: {
    flexDirection: 'row',
    backgroundColor: '#4D7CFE',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4D7CFE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  sendBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    shadowOpacity: 0,
  },
  sendBtnText: {
    color: '#0A0A0B',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },
  sendBtnTextDisabled: {
    color: '#4A4A4F',
  }
});
