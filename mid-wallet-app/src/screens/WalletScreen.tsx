import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useWalletStore } from '../store/walletStore';
import { useIdentity } from '../context/IdentityContext';
import FCDIDCard from '../components/FCDIDCard';
import WalletCard from '../components/WalletCard';
import AssetList from '../components/AssetList';
import ZKPVerificationOverlay from '../components/ZKPVerificationOverlay';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, withDelay } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const mono = Platform.select({ web: '"IBM Plex Mono", monospace', default: Platform.OS === 'ios' ? 'Menlo' : 'monospace' });

export default function WalletScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const fetchOnChainData = useWalletStore(state => state.fetchOnChainData);
  const { isZkpVerified, unlockIdentity } = useIdentity();
  const [showZkpOverlay, setShowZkpOverlay] = useState(false);

  const handleIdentityUnlock = () => {
    setShowZkpOverlay(true);
  };

  const onZkpSuccess = () => {
    setShowZkpOverlay(false);
    unlockIdentity();
  };

  // Network Pulse Animation
  const netPulseOpacity = useSharedValue(0.2);
  const netTextOpacity = useSharedValue(0);

  useEffect(() => {
    fetchOnChainData();

    netPulseOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.2, { duration: 800 })
      ), -1, true
    );
    netTextOpacity.value = withDelay(500, withTiming(1, { duration: 1500 }));
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: netPulseOpacity.value }));
  const textFadeStyle = useAnimatedStyle(() => ({ opacity: netTextOpacity.value }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Cyberpunk Grid Background */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <LinearGradient 
          colors={['rgba(77, 124, 254, 0.05)', 'transparent']} 
          style={{ height: height * 0.4, width: '100%', position: 'absolute', top: 0 }} 
        />
        <View style={styles.gridOverlay} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dashboardContainer}>
            
            {/* Secure Network Status */}
            <Animated.View style={[styles.networkStatusBar, textFadeStyle]}>
               <Animated.View style={[styles.networkDot, pulseStyle]} />
               <Text style={styles.networkText}>MSR-NET_ENCRYPTED :: SECURE CONNECTION ESTABLISHED</Text>
            </Animated.View>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.logoBox}>
                  <View style={styles.logoDot} />
                  <View style={[styles.logoDot, { left: 4, top: 12 }]} />
                  <View style={[styles.logoDot, { right: 4, top: 12 }]} />
                  <Text style={styles.logoText}>MID</Text>
                </View>
                <Text style={styles.headerTitle}>MID Wallet</Text>
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="search" size={18} color="#8A8A8E" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="add" size={22} color="#8A8A8E" />
                </TouchableOpacity>
              </View>
            </View>

            {/* 1. Sovereign Identity Card */}
            <FCDIDCard />

            {/* 2. Total Balance Card */}
            <View style={{ marginTop: 20 }}>
              <WalletCard />
            </View>

            {/* 3. Core Actions */}
            <View style={[styles.actionsRow, { marginTop: 24 }]}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Transfer')}>
                <Ionicons name="arrow-up" size={16} color="#A0A9B8" style={[styles.actionIcon, { transform: [{ rotate: '45deg' }] }]} />
                <Text style={styles.actionBtnText}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Receive')}>
                <Ionicons name="arrow-down" size={16} color="#A0A9B8" style={[styles.actionIcon, { transform: [{ rotate: '45deg' }] }]} />
                <Text style={styles.actionBtnText}>Receive</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Verify')}>
                <Ionicons name="scan-outline" size={16} color="#A0A9B8" style={styles.actionIcon} />
                <Text style={styles.actionBtnText}>Verify</Text>
              </TouchableOpacity>
            </View>

            {/* 4. Asset List */}
            <AssetList />
            
          </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#04060A',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 20,
  },
  // Dashboard Styles
  dashboardContainer: {
    padding: 20,
    paddingTop: 10,
  },
  networkStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(71, 199, 120, 0.08)',
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(71, 199, 120, 0.3)',
  },
  networkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#47C778',
    marginRight: 8,
    shadowColor: '#47C778',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  networkText: {
    color: '#47C778',
    fontSize: 9,
    fontFamily: mono,
    letterSpacing: 2,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 26,
    height: 26,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoDot: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#4D7CFE',
    top: 2,
  },
  logoText: {
    color: '#4D7CFE',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerTitle: {
    color: '#F4F7FB',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  balanceSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 32,
  },
  balanceLabel: {
    color: '#7E8BA0',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  balanceAmount: {
    color: '#F4F7FB',
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
  },
  balanceDecimals: {
    color: '#A0A9B8',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  changePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(71, 199, 120, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  changeText: {
    color: '#47C778',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    height: 44,
    flex: 1,
    marginHorizontal: 5,
  },
  actionBtnActive: {
    backgroundColor: 'rgba(77, 124, 254, 0.15)',
    borderColor: 'rgba(77, 124, 254, 0.5)',
    shadowColor: '#4D7CFE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 3,
  },
  actionIcon: {
    marginRight: 6,
  },
  actionBtnText: {
    color: '#E8ECF3',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  actionBtnTextActive: {
    color: '#4D7CFE',
  },
  profileStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0A0F17',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    padding: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  profileInfo: {
    justifyContent: 'center',
  },
  profileName: {
    color: '#F4F7FB',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileId: {
    color: '#7E8BA0',
    fontSize: 10,
    fontFamily: mono,
    letterSpacing: 1,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(71, 199, 120, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(71, 199, 120, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#47C778',
    marginRight: 6,
  },
  activeText: {
    color: '#47C778',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#A0A9B8',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  seeAll: {
    color: '#4D7CFE',
    fontSize: 12,
    fontWeight: '600',
  },
  cardBlock: {
    backgroundColor: 'rgba(10, 15, 23, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(77, 124, 254, 0.15)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#4D7CFE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  networkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(77, 124, 254, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(77, 124, 254, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  networkLetter: {
    color: '#4D7CFE',
    fontSize: 16,
    fontWeight: '700',
  },
  networkRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  tokenName: {
    color: '#F4F7FB',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  tokenAmount: {
    color: '#7E8BA0',
    fontSize: 12,
  },
  fiatValue: {
    color: '#F4F7FB',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  fiatLabel: {
    color: '#7E8BA0',
    fontSize: 12,
  },
  assetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    paddingBottom: 16,
    marginBottom: 16,
  },
  assetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  assetRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  assetChangeUp: {
    color: '#47C778',
    fontSize: 12,
    fontWeight: '600',
  },

});
