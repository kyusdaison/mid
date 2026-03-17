import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const mono = Platform.select({ web: '"IBM Plex Mono", monospace', default: Platform.OS === 'ios' ? 'Menlo' : 'monospace' });

export default function BuyScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [amount, setAmount] = useState('0');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={['rgba(77, 124, 254, 0.05)', '#04060A']} style={StyleSheet.absoluteFillObject} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#D4D8E0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>BUY ASSETS</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.inputContainer}>
          <Text style={styles.buyLabel}>You Pay (USD)</Text>
          <View style={styles.inputRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="#2A303C"
            />
          </View>
        </View>

        <View style={styles.rateCard}>
          <View style={styles.rateRow}>
            <Text style={styles.rateLabel}>Exchange Rate</Text>
            <Text style={styles.rateValue}>1 MSD = $1.00 USD</Text>
          </View>
          <View style={styles.rateRow}>
            <Text style={styles.rateLabel}>Network Fee</Text>
            <Text style={styles.rateValue}>$0.02</Text>
          </View>
          <View style={[styles.rateRow, { borderBottomWidth: 0, paddingBottom: 0, marginTop: 4 }]}>
            <Text style={styles.totalLabel}>You Will Receive</Text>
            <Text style={styles.totalValue}>{amount || '0'} MSD</Text>
          </View>
        </View>

        <View style={styles.paymentMethods}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity style={[styles.methodCard, styles.methodCardActive]}>
            <Ionicons name="card" size={24} color="#4D7CFE" />
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>Credit Card</Text>
              <Text style={styles.methodDetail}>Visa ending in 4242</Text>
            </View>
            <Ionicons name="checkmark-circle" size={20} color="#47C778" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.methodCard}>
            <Ionicons name="logo-apple" size={24} color="#D4D8E0" />
            <View style={styles.methodInfo}>
              <Text style={styles.methodName}>Apple Pay</Text>
              <Text style={styles.methodDetail}>Instant processing</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.buyBtn}>
          <Text style={styles.buyBtnText}>CONFIRM PURCHASE</Text>
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
  inputContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  buyLabel: {
    color: '#7E8BA0',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    color: '#F4F7FB',
    fontSize: 48,
    fontWeight: '700',
    marginRight: 8,
  },
  amountInput: {
    color: '#F4F7FB',
    fontSize: 64,
    fontWeight: '800',
    minWidth: 100,
  },
  rateCard: {
    backgroundColor: 'rgba(10, 15, 23, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(77, 124, 254, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  rateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  rateLabel: {
    color: '#7E8BA0',
    fontSize: 14,
  },
  rateValue: {
    color: '#D4D8E0',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: mono,
  },
  totalLabel: {
    color: '#4D7CFE',
    fontSize: 14,
    fontWeight: '700',
  },
  totalValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  paymentMethods: {
    marginTop: 10,
  },
  sectionTitle: {
    color: '#7E8BA0',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  methodCardActive: {
    backgroundColor: 'rgba(77, 124, 254, 0.1)',
    borderColor: 'rgba(77, 124, 254, 0.4)',
  },
  methodInfo: {
    flex: 1,
    marginLeft: 16,
  },
  methodName: {
    color: '#D4D8E0',
    fontSize: 16,
    fontWeight: '600',
  },
  methodDetail: {
    color: '#7E8BA0',
    fontSize: 12,
    marginTop: 4,
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
  buyBtn: {
    backgroundColor: '#4D7CFE',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4D7CFE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buyBtnText: {
    color: '#0A0A0B',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2,
  }
});
