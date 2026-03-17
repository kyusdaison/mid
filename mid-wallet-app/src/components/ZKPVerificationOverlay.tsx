import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withRepeat,
  Easing
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const mono = Platform.select({ web: '"IBM Plex Mono", monospace', default: Platform.OS === 'ios' ? 'Menlo' : 'monospace' });

interface Props {
  isVisible: boolean;
  onVerificationComplete?: () => void;
}

// Helper to generate random hex strings for the "cryptographic" effect
const generateHexString = (length: number) => {
  return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
};

export default function ZKPVerificationOverlay({ isVisible, onVerificationComplete }: Props) {
  const opacity = useSharedValue(0);
  const scanLineY = useSharedValue(0);
  const pulseScale = useSharedValue(0.8);
  const pulseOpacity = useSharedValue(0);
  
  const [cryptoStream, setCryptoStream] = useState<string[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isVisible) {
      // Fade in overlay
      opacity.value = withTiming(1, { duration: 400 });

      // Holographic Pulse effect
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 1000, easing: Easing.out(Easing.quad) }),
          withTiming(0.8, { duration: 0 }) // Reset immediately
        ),
        -1,
        false
      );

      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 200, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 800, easing: Easing.in(Easing.quad) })
        ),
        -1,
        false
      );

      // Start "scanning" animation
      scanLineY.value = withRepeat(
        withSequence(
          withTiming(width * 0.7, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      
      // Update crypto stream
      interval = setInterval(() => {
        setCryptoStream(prev => {
          const newStream = [generateHexString(16), generateHexString(16), generateHexString(16)];
          return newStream;
        });
      }, 150);

      // Simulate ZKP processing time (e.g., 3 seconds)
      const timer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 400 });
        if (onVerificationComplete) onVerificationComplete();
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    } else {
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    zIndex: opacity.value > 0 ? 1000 : -1, 
  }));

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  if (!isVisible && opacity.value === 0) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill}>
        
        <View style={styles.gridOverlay}>
          {/* Subtle grid lines could go here via a background pattern */}
        </View>

        <View style={styles.content}>
          <Text style={styles.securityHeader}>GOVT. OF MONTSERRAT // HIGH SECURITY</Text>

          {/* Crypto Stream Background */}
          <View style={styles.cryptoBox}>
             {cryptoStream.map((hex, i) => (
                <Text key={i} style={styles.cryptoText}>{hex}</Text>
             ))}
          </View>
          
          {/* Scanning Reticle */}
          <View style={styles.reticle}>
            <Animated.View style={[styles.pulseCircle, pulseStyle]} />
            
            {/* The actual scan line */}
            <View style={styles.scanArea}>
              <Animated.View style={[styles.scanLine, scanLineStyle]}>
                <LinearGradient 
                  colors={['rgba(77, 124, 254, 0)', 'rgba(77, 124, 254, 0.8)', 'rgba(77, 124, 254, 0)']} 
                  start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            </View>

            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            
            <View style={styles.fingerprintPlaceholder}>
               <Text style={styles.fingerprintIcon}>◎</Text>
            </View>
          </View>

          <Text style={styles.processingText}>COMPUTING ZERO-KNOWLEDGE PROOF</Text>
          <View style={styles.progressBarBg}>
             <View style={styles.progressBarFill} />
          </View>
          <Text style={styles.subText}>Authenticating Sovereign Identity...</Text>

        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
    // Future: implement thin repeating SVG or lines here
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(4, 6, 10, 0.85)', // Very deep dark blue/black
  },
  securityHeader: {
    position: 'absolute',
    top: 60,
    color: '#4D7CFE',
    fontSize: 10,
    letterSpacing: 3,
    fontFamily: mono,
    fontWeight: '800',
    opacity: 0.8,
  },
  cryptoBox: {
    position: 'absolute',
    alignItems: 'center',
    top: height * 0.25,
    opacity: 0.3,
  },
  cryptoText: {
    color: '#47C778', // Cryptographic green
    fontFamily: mono,
    fontSize: 12,
    letterSpacing: 4,
    marginBottom: 4,
  },
  reticle: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 1,
    borderColor: 'rgba(77, 124, 254, 0.2)', // Faint blue guide
    position: 'relative',
    marginBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  scanLine: {
    width: '100%',
    height: 3,
    shadowColor: '#4D7CFE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  pulseCircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#4D7CFE',
    backgroundColor: 'rgba(77, 124, 254, 0.1)',
  },
  fingerprintPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(10, 15, 23, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(77, 124, 254, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  fingerprintIcon: {
    color: '#4D7CFE',
    fontSize: 32,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#4D7CFE',
  },
  topLeft: {
    top: 0, left: 0,
    borderTopWidth: 2, borderLeftWidth: 2,
  },
  topRight: {
    top: 0, right: 0,
    borderTopWidth: 2, borderRightWidth: 2,
  },
  bottomLeft: {
    bottom: 0, left: 0,
    borderBottomWidth: 2, borderLeftWidth: 2,
  },
  bottomRight: {
    bottom: 0, right: 0,
    borderBottomWidth: 2, borderRightWidth: 2,
  },
  processingText: {
    color: '#E8ECF3',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    fontFamily: mono,
    marginBottom: 16,
    textShadowColor: 'rgba(77, 124, 254, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  progressBarBg: {
    width: 200,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 12,
  },
  progressBarFill: {
    width: '60%', // Could animate this too
    height: '100%',
    backgroundColor: '#4D7CFE',
    shadowColor: '#4D7CFE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  subText: {
    color: '#7E8BA0',
    fontSize: 11,
    letterSpacing: 1.5,
    fontFamily: mono,
    textTransform: 'uppercase',
  }
});
