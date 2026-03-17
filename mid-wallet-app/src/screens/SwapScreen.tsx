import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const mono = Platform.select({ web: '"IBM Plex Mono", monospace', default: Platform.OS === 'ios' ? 'Menlo' : 'monospace' });

export default function SwapScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [fromAmount, setFromAmount] = useState('');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={['rgba(77, 124, 254, 0.05)', '#04060A']} style={StyleSheet.absoluteFillObject} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#D4D8E0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SWAP ASSETS</Text>
        <View style={styles.settingsBtn}>
          <Ionicons name="options" size={20} color="#8A8A8E" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* From Token */}
        <View style={styles.swapCard}>
          <View style={styles.swapCardHeader}>
            <Text style={styles.swapLabel}>You Pay</Text>
            <Text style={styles.balanceText}>Balance: 11.420</Text>
          </View>
          
          <View style={styles.inputRow}>
            <TextInput
              style={styles.amountInput}
              keyboardType="numeric"
              value={fromAmount}
              onChangeText={setFromAmount}
              placeholder="0.0"
              placeholderTextColor="#2A303C"
            />
            <TouchableOpacity style={styles.tokenSelector}>
              <View style={[styles.tokenIcon, { backgroundColor: '#627EEA' }]}>
                <Ionicons name="logo-stencil" size={14} color="#FFF" />
              </View>
              <Text style={styles.tokenName}>ETH</Text>
              <Ionicons name="chevron-down" size={16} color="#D4D8E0" />
            </TouchableOpacity>
          </View>
          <Text style={styles.fiatEstimate}>${fromAmount ? (parseFloat(fromAmount) * 1647).toFixed(2) : '0.00'}</Text>
        </View>

        {/* Swap Button (Middle) */}
        <View style={styles.middleRow}>
          <View style={styles.line} />
          <TouchableOpacity style={styles.swapIconBtn}>
            <Ionicons name="swap-vertical" size={24} color="#4D7CFE" />
          </TouchableOpacity>
          <View style={styles.line} />
        </View>

        {/* To Token */}
        <View style={styles.swapCard}>
          <View style={styles.swapCardHeader}>
            <Text style={styles.swapLabel}>You Receive</Text>
          </View>
          
          <View style={styles.inputRow}>
            <Text style={[styles.amountInput, { color: fromAmount ? '#fff' : '#2A303C' }]}>
              {fromAmount ? (parseFloat(fromAmount) * 1647).toFixed(4) : '0.0'}
            </Text>
            <TouchableOpacity style={styles.tokenSelector}>
              <View style={[styles.tokenIcon, { backgroundColor: '#4D7CFE' }]}>
                <Text style={styles.tokenLetter}>M</Text>
              </View>
              <Text style={styles.tokenName}>MSD</Text>
              <Ionicons name="chevron-down" size={16} color="#D4D8E0" />
            </TouchableOpacity>
          </View>
          <Text style={styles.fiatEstimate}>${fromAmount ? (parseFloat(fromAmount) * 1647).toFixed(2) : '0.00'}</Text>
        </View>

        {/* Exchange Rate Details */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Exchange Rate</Text>
            <Text style={styles.detailValue}>1 ETH = 1,647.00 MSD</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Slippage Tolerance</Text>
            <Text style={styles.detailValue}>0.5%</Text>
          </View>
          <View style={[styles.detailRow, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
            <Text style={styles.detailLabel}>Network Fee</Text>
            <Text style={styles.detailValue}>~ $0.45</Text>
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.swapBtn, !fromAmount && styles.swapBtnDisabled]}>
          <Text style={styles.swapBtnText}>REVIEW SWAP</Text>
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
  settingsBtn: {
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
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  swapCard: {
    backgroundColor: 'rgba(10, 15, 23, 0.8)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(77, 124, 254, 0.15)',
  },
  swapCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  swapLabel: {
    color: '#7E8BA0',
    fontSize: 13,
    fontWeight: '600',
  },
  balanceText: {
    color: '#7E8BA0',
    fontSize: 12,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountInput: {
    flex: 1,
    color: '#F4F7FB',
    fontSize: 40,
    fontWeight: '800',
    fontFamily: mono,
  },
  tokenSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tokenIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  tokenLetter: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tokenName: {
    color: '#F4F7FB',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  fiatEstimate: {
    color: '#7E8BA0',
    fontSize: 13,
    marginTop: 8,
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    position: 'relative',
    height: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  swapIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#04060A',
    borderWidth: 2,
    borderColor: 'rgba(77, 124, 254, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 10,
  },
  detailsCard: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  detailLabel: {
    color: '#7E8BA0',
    fontSize: 13,
  },
  detailValue: {
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
  swapBtn: {
    backgroundColor: '#4D7CFE',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4D7CFE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  swapBtnDisabled: {
    backgroundColor: 'rgba(77, 124, 254, 0.3)',
    shadowOpacity: 0,
  },
  swapBtnText: {
    color: '#0A0A0B',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2,
  }
});
