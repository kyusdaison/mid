import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useIdentity } from '../context/IdentityContext';

const { width, height } = Dimensions.get('window');
const mono = Platform.select({
  web: '"IBM Plex Mono", monospace',
  default: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
});

const TRUST_BLUE = '#4A8FE7';
const SHIELD_SIZE = 96;

export default function LockScreen() {
  const insets = useSafeAreaInsets();
  const { unlockIdentity } = useIdentity();

  // Shield pulse
  const shieldGlow = useSharedValue(0.3);
  const shieldScale = useSharedValue(1);

  // Lock ring rotation
  const ringOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0.8);

  // Text fade-in
  const textOpacity = useSharedValue(0);

  // Button glow
  const btnGlow = useSharedValue(0.5);

  useEffect(() => {
    // Shield slow pulse
    shieldGlow.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    shieldScale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Ring expand on mount
    ringOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    ringScale.value = withDelay(300, withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.2)) }));

    // Text fade in
    textOpacity.value = withDelay(600, withTiming(1, { duration: 1000 }));

    // Button breathe
    btnGlow.value = withRepeat(
      withSequence(
        withDelay(1200, withTiming(1, { duration: 1500 })),
        withTiming(0.5, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const shieldStyle = useAnimatedStyle(() => ({
    opacity: shieldGlow.value,
    transform: [{ scale: shieldScale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const btnGlowStyle = useAnimatedStyle(() => ({
    opacity: btnGlow.value,
  }));

  const handleUnlock = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (hasHardware && isEnrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verify identity to unlock MID Wallet',
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
      });

      if (result.success) {
        unlockIdentity();
      } else if (result.error !== 'user_cancel' && result.error !== 'system_cancel') {
        Alert.alert(
          'Verification Failed',
          'Unable to verify your identity. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } else {
      // No biometric hardware — unlock directly (dev/simulator fallback)
      unlockIdentity();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Background gradient */}
      <LinearGradient
        colors={['rgba(74, 143, 231, 0.06)', 'transparent', 'rgba(74, 143, 231, 0.03)']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Grid overlay */}
      <View style={styles.gridOverlay} pointerEvents="none" />

      {/* Top branding */}
      <Animated.View style={[styles.brandRow, textStyle]}>
        <Text style={styles.brandText}>MID WALLET</Text>
        <View style={styles.brandBadge}>
          <Text style={styles.brandBadgeText}>FCDID</Text>
        </View>
      </Animated.View>

      {/* Center — Shield */}
      <View style={styles.shieldArea}>
        {/* Outer ring */}
        <Animated.View style={[styles.outerRing, ringStyle]} />

        {/* Inner glow */}
        <Animated.View style={[styles.shieldGlow, shieldStyle]} />

        {/* Shield icon */}
        <Animated.View style={[styles.shieldIconWrap, shieldStyle]}>
          <Ionicons name="shield-checkmark" size={SHIELD_SIZE} color={TRUST_BLUE} />
          {/* Lock badge */}
          <View style={styles.lockBadge}>
            <Ionicons name="lock-closed" size={18} color="#fff" />
          </View>
        </Animated.View>
      </View>

      {/* Status text */}
      <Animated.View style={[styles.statusBlock, textStyle]}>
        <Text style={styles.statusLabel}>SOVEREIGN IDENTITY</Text>
        <Text style={styles.statusTitle}>Identity Protected</Text>
        <Text style={styles.statusSub}>
          Your digital identity is secured.{'\n'}Biometric verification required to unlock.
        </Text>

        {/* DID hash preview */}
        <View style={styles.didRow}>
          <Ionicons name="finger-print" size={14} color={TRUST_BLUE} style={{ marginRight: 6 }} />
          <Text style={styles.didHash}>FCDID · ••••-••••-••••-••••</Text>
        </View>
      </Animated.View>

      {/* Unlock button */}
      <View style={styles.btnArea}>
        {/* Glow behind button */}
        <Animated.View style={[styles.btnGlow, btnGlowStyle]} />

        <TouchableOpacity style={styles.unlockBtn} onPress={handleUnlock} activeOpacity={0.8}>
          <Ionicons name="finger-print" size={22} color="#000" style={{ marginRight: 10 }} />
          <Text style={styles.unlockBtnText}>Unlock Identity</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Animated.View style={[styles.footer, textStyle]}>
        <Text style={styles.footerText}>Montserrat Digital Residency · Gov. Issued Identity</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.04,
    // Simulated grid via border pattern (React Native compatible)
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 10,
  },
  brandText: {
    fontFamily: mono,
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 3,
  },
  brandBadge: {
    borderWidth: 1,
    borderColor: TRUST_BLUE,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  brandBadgeText: {
    fontFamily: mono,
    fontSize: 10,
    color: TRUST_BLUE,
    letterSpacing: 2,
  },
  shieldArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: SHIELD_SIZE * 2.2,
    height: SHIELD_SIZE * 2.2,
    borderRadius: SHIELD_SIZE * 1.1,
    borderWidth: 1,
    borderColor: `${TRUST_BLUE}30`,
  },
  shieldGlow: {
    position: 'absolute',
    width: SHIELD_SIZE * 1.6,
    height: SHIELD_SIZE * 1.6,
    borderRadius: SHIELD_SIZE * 0.8,
    backgroundColor: `${TRUST_BLUE}12`,
  },
  shieldIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#1A1A2E',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBlock: {
    alignItems: 'center',
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  statusLabel: {
    fontFamily: mono,
    fontSize: 11,
    color: TRUST_BLUE,
    letterSpacing: 3,
    marginBottom: 10,
  },
  statusTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  statusSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  didRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 143, 231, 0.08)',
    borderWidth: 1,
    borderColor: `${TRUST_BLUE}30`,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  didHash: {
    fontFamily: mono,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
  },
  btnArea: {
    width: '100%',
    paddingHorizontal: 32,
    marginBottom: 24,
    alignItems: 'center',
  },
  btnGlow: {
    position: 'absolute',
    width: width * 0.6,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${TRUST_BLUE}25`,
    top: -8,
  },
  unlockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TRUST_BLUE,
    borderRadius: 14,
    paddingVertical: 16,
    width: '100%',
  },
  unlockBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.5,
  },
  footer: {
    marginBottom: 12,
  },
  footerText: {
    fontFamily: mono,
    fontSize: 10,
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: 1,
    textAlign: 'center',
  },
});
