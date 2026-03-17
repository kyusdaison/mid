import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useWalletStore } from '../store/walletStore';
import { Ionicons } from '@expo/vector-icons';

const mono = Platform.select({ web: '"IBM Plex Mono", monospace', default: Platform.OS === 'ios' ? 'Menlo' : 'monospace' });

export default function WalletCard() {
  const totalBalanceUsd = useWalletStore((state) => state.totalBalanceUsd);
  
  // Format balance helper
  const formattedBalance = totalBalanceUsd.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });

  // Simple floating animation for the card
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [floatAnim]);

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ translateY: floatAnim }] }]}>
      <BlurView intensity={28} tint="dark" style={styles.cardContainer}>
        <LinearGradient
          colors={['rgba(77, 124, 254, 0.15)', 'rgba(0, 0, 0, 0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoInitial}>M</Text>
            </View>
            <Text style={styles.cardTitle}>Montserrat Digital</Text>
          </View>
          <View style={styles.badgeWrapper}>
            <Ionicons name="shield-checkmark" size={10} color="#47C778" style={{marginRight: 4}} />
            <Text style={styles.badge}>MSR NODE SECURED</Text>
          </View>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>TOTAL LIQUIDITY</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <Text style={styles.balance}>{formattedBalance}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.footerLabel}>PRIMARY ALIAS</Text>
            <Text style={styles.footerValue}>@nuo_wang.mon</Text>
          </View>
          <Ionicons name="wifi" size={20} color="rgba(255,255,255,0.4)" style={{ transform: [{ rotate: '90deg' }] }} />
        </View>
        
        {/* Glow effect lines */}
        <View style={styles.glowLineTop} />
        <View style={styles.glowLineBottom} />
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
    shadowColor: '#4D7CFE',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  cardContainer: {
    width: '100%',
    height: 230,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(77, 124, 254, 0.25)',
    backgroundColor: 'rgba(10, 14, 22, 0.6)',
    padding: 24,
    justifyContent: 'space-between',
  },
  glowLineTop: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: 1,
    backgroundColor: '#4D7CFE',
    shadowColor: '#4D7CFE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  glowLineBottom: {
    position: 'absolute',
    bottom: 0,
    left: '40%',
    right: '40%',
    height: 1,
    backgroundColor: '#84B2FF',
    shadowColor: '#84B2FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(77, 124, 254, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(77, 124, 254, 0.4)',
  },
  logoInitial: {
    color: '#EAF2FF',
    fontSize: 14,
    fontWeight: '800',
    fontFamily: mono,
  },
  cardTitle: {
    color: '#D0D7E2',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(71, 199, 120, 0.1)',
    borderColor: 'rgba(71, 199, 120, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badge: {
    color: '#47C778',
    fontSize: 8,
    fontFamily: mono,
    fontWeight: '700',
    letterSpacing: 1,
  },
  balanceContainer: {
    marginTop: 10,
  },
  balanceLabel: {
    color: '#8E98A8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 6,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencySymbol: {
    color: '#7FB3FF',
    fontSize: 24,
    fontWeight: '600',
    marginRight: 4,
  },
  balance: {
    color: '#F4F7FB',
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: 1,
    fontFamily: mono,
    textShadowColor: 'rgba(77, 124, 254, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerLabel: {
    color: '#7E8BA0',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  footerValue: {
    color: '#C7D1E0',
    fontSize: 14,
    fontFamily: mono,
    letterSpacing: 0.5,
  }
});
