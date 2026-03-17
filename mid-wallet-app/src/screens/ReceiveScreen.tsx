import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useWalletStore } from '../store/walletStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function ReceiveScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { walletAddress } = useWalletStore();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#D4D8E0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>RECEIVE ASSETS</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.qrContainer}>
          {/* Placeholder for QR Code */}
          <LinearGradient colors={['#1c212e', '#0b1016']} style={styles.qrPlaceholder}>
            <Ionicons name="qr-code-outline" size={120} color="#4A8FE7" />
            <Text style={styles.scanText}>SCAN TO RECEIVE</Text>
          </LinearGradient>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Your Wallet Address</Text>
          <View style={styles.addressBox}>
            <Text style={styles.addressText}>{walletAddress || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}</Text>
            <TouchableOpacity style={styles.copyBtn}>
              <Ionicons name="copy-outline" size={18} color="#4A8FE7" />
            </TouchableOpacity>
          </View>
          <Text style={styles.footerNotice}>Only send Montserrat Network (MID) compatible assets to this address. Sending other assets may result in permanent loss.</Text>
        </View>
        
        <TouchableOpacity style={styles.shareBtn}>
          <Ionicons name="share-outline" size={20} color="#0A0A0B" style={{marginRight: 8}}/>
          <Text style={styles.shareBtnText}>SHARE ADDRESS</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0B',
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
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  qrContainer: {
    marginTop: 40,
    marginBottom: 40,
    shadowColor: '#4A8FE7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
  },
  qrPlaceholder: {
    width: 240,
    height: 240,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(74, 143, 231, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    color: '#4A8FE7',
    marginTop: 20,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
  infoCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 30,
  },
  label: {
    color: '#8A8A8E',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  addressText: {
    flex: 1,
    color: '#D4D8E0',
    fontSize: 13,
    fontFamily: 'monospace',
  },
  copyBtn: {
    padding: 5,
    marginLeft: 10,
  },
  footerNotice: {
    marginTop: 15,
    color: '#6e7787',
    fontSize: 11,
    lineHeight: 16,
  },
  shareBtn: {
    flexDirection: 'row',
    backgroundColor: '#4A8FE7',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#4A8FE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  shareBtnText: {
    color: '#0A0A0B',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  }
});
