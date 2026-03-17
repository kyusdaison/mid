import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  withDelay,
  Easing
} from 'react-native-reanimated';
import { useWalletStore } from '../store/walletStore';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const mono = Platform.select({ web: '"IBM Plex Mono", monospace', default: Platform.OS === 'ios' ? 'Menlo' : 'monospace' });

// Function to generate a pseudo-random hash
const generateHash = () => {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 65536).toString(16).padStart(4, '0')).join('-');
};

export default function FCDIDCard() {
  const fcdid = useWalletStore((state) => state.fcdid) || '0xUNKNOWN...';
  
  // Animation values
  const floatY = useSharedValue(0);
  const glowOpacity = useSharedValue(0.4);
  const scanLineY = useSharedValue(0);
  const [activeHash, setActiveHash] = useState(generateHash());

  useEffect(() => {
    // Holographic floating effect
    floatY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Pulse glow effect
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Occasional scan line passing over card
    scanLineY.value = withRepeat(
        withSequence(
            withDelay(4000, withTiming(250, { duration: 2000, easing: Easing.inOut(Easing.ease) })),
            withTiming(0, { duration: 0 })
        ),
        -1,
        false
    );

    const hashTimer = setInterval(() => {
        setActiveHash(generateHash());
    }, 5000);

    return () => clearInterval(hashTimer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
    opacity: scanLineY.value > 0 && scanLineY.value < 240 ? 0.8 : 0,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Background Holographic Glow */}
      <Animated.View style={[styles.glow, glowStyle]} />

      <BlurView intensity={70} tint="dark" style={styles.card}>
        <LinearGradient
          colors={['rgba(77, 124, 254, 0.15)', 'rgba(10, 15, 25, 0.9)', 'rgba(4, 6, 12, 1)']}
          locations={[0.0, 0.5, 1.0]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Watermark / Seal */}
          <View style={styles.watermark}>
             <Ionicons name="globe-outline" size={180} color="rgba(77, 124, 254, 0.05)" />
          </View>

          {/* Hologram Box */}
          <View style={styles.hologramChip}>
              <LinearGradient 
                colors={['#FF00A0', '#4D7CFE', '#00FFC2']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
                />
              <View style={styles.hologramInner}>
                 <Text style={styles.hologramText}>MSR</Text>
              </View>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.govTitle}>GOVERNMENT OF MONTSERRAT</Text>
              <Text style={styles.docType}>SOVEREIGN E-RESIDENCY // SECURE ID</Text>
            </View>
          </View>

          {/* Data Grid */}
          <View style={styles.dataGrid}>
              <View style={styles.dataRow}>
                  <View style={styles.dataBlock}>
                    <Text style={styles.label}>HOLDER AUTHORITY</Text>
                    <Text style={styles.valuePrimary}>VANGUARD</Text>
                  </View>
                  <View style={styles.dataBlockAlignRight}>
                    <Text style={styles.label}>CLASSIFICATION</Text>
                    <Text style={[styles.valuePrimary, { color: '#47C778' }]}>CLASS I</Text>
                  </View>
              </View>
              
              <View style={styles.dataRow}>
                  <View style={styles.dataBlock}>
                    <Text style={styles.label}>RESIDENCY ID</Text>
                    <Text style={styles.valueMono}>MSR-2026-00147</Text>
                  </View>
                  <View style={styles.dataBlockAlignRight}>
                     <Text style={styles.label}>ISSUED</Text>
                     <Text style={styles.valueMono}>2024.03.17</Text>
                  </View>
              </View>
          </View>

          {/* Fingerprint / Hash Line */}
          <View style={styles.cryptoStrip}>
             <Ionicons name="finger-print" size={20} color="#4D7CFE" style={{ marginRight: 8, opacity: 0.8 }} />
             <Text style={styles.hashText}>AUTH_HASH:: {activeHash}</Text>
          </View>

          {/* Bottom Row - Status */}
          <View style={styles.statusRow}>
              <View style={styles.flex1}>
                <Text style={styles.label}>ON-CHAIN DID (FCDID)</Text>
                <Text style={styles.didText} numberOfLines={1} ellipsizeMode="middle">{fcdid}</Text>
              </View>
              <View style={styles.verifiedBadge}>
                 <Ionicons name="checkmark-done" size={14} color="#0A0A0B" style={{ marginRight: 4 }}/>
                 <Text style={styles.valueVerified}>VERIFIED</Text>
              </View>
          </View>

          {/* Animated Scan Line */}
          <Animated.View style={[styles.scanLine, scanLineStyle]} />
          
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    height: 230, // Taller for more techy layout
    marginVertical: 15,
    borderRadius: 16,
    alignSelf: 'center',
    shadowColor: '#4D7CFE',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#4D7CFE',
    borderRadius: 16,
    transform: [{ scale: 1.02 }],
    opacity: 0.5,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(77, 124, 254, 0.4)',
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  gradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  watermark: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    zIndex: -1,
    transform: [{ rotate: '-15deg' }]
  },
  hologramChip: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 40,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  hologramInner: {
    flex: 1,
    margin: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hologramText: {
    color: '#FFF',
    fontSize: 9,
    fontFamily: mono,
    fontWeight: '800',
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingRight: 40, // space for chip
  },
  govTitle: {
    color: '#E8ECF3',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 4,
  },
  docType: {
    color: '#4D7CFE',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    fontFamily: mono,
  },
  dataGrid: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderColor: 'rgba(77, 124, 254, 0.15)',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dataBlock: {
    flex: 1,
  },
  dataBlockAlignRight: {
    alignItems: 'flex-end',
  },
  flex1: {
    flex: 1,
    paddingRight: 10,
  },
  label: {
    color: '#7E8BA0',
    fontSize: 9,
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: mono,
  },
  valuePrimary: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  valueMono: {
    color: '#E8ECF3',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: mono,
    letterSpacing: 0.5,
  },
  cryptoStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(77, 124, 254, 0.08)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginVertical: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#4D7CFE',
  },
  hashText: {
    color: 'rgba(77, 124, 254, 0.8)',
    fontSize: 10,
    fontFamily: mono,
    letterSpacing: 1,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  didText: {
    color: '#8A99A8',
    fontSize: 12,
    fontFamily: mono,
    letterSpacing: 0.5,
  },
  verifiedBadge: {
    backgroundColor: '#47C778',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#47C778',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  valueVerified: {
    color: '#0A0A0B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#4D7CFE',
    shadowColor: '#4D7CFE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  }
});
