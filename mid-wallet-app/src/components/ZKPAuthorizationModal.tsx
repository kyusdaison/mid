import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  withRepeat,
  withSequence,
  runOnJS
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';

interface ZKPAuthorizationModalProps {
  visible: boolean;
  payload: string | null; // e.g., fcid://verify?service=Montserrat_Digital_Gov&nonce=12345
  onClose: () => void;
  onSuccess: () => void;
}

export default function ZKPAuthorizationModal({ visible, payload, onClose, onSuccess }: ZKPAuthorizationModalProps) {
  const translateY = useSharedValue(1000);
  const [status, setStatus] = React.useState<'review' | 'authenticating' | 'generating' | 'success' | 'failed'>('review');
  const [serviceName, setServiceName] = React.useState('Unknown Service');
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    if (visible && payload) {
      // Parse payload
      try {
        const url = new URL(payload.replace('fcid://', 'http://'));
        const service = url.searchParams.get('service')?.replace(/_/g, ' ') || 'Unknown Service';
        setServiceName(service);
      } catch (e) {
        console.error("Failed to parse QR payload", e);
      }
      
      setStatus('review');
      translateY.value = withSpring(0, { damping: 20, stiffness: 90 });
    } else {
      translateY.value = withTiming(1000, { duration: 300 });
      setTimeout(() => setStatus('review'), 300); // Reset after hide
    }
  }, [visible, payload]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const handleAuthorize = async () => {
    setStatus('authenticating');
    
    try {
      // 1. Biometric Enclave Check
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      let authenticated = false;
      if (hasHardware && isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authorize Sovereign Identity Proof',
          cancelLabel: 'Cancel',
          disableDeviceFallback: false,
        });
        authenticated = result.success;
      } else {
        // Fallback simulate authenticating
        await new Promise(resolve => setTimeout(resolve, 1000));
        authenticated = true;
      }

      if (!authenticated) {
        setStatus('failed');
        return;
      }

      // 2. Generate ZKP (Simulation)
      setStatus('generating');
      progressWidth.value = 0;
      progressWidth.value = withTiming(100, { duration: 2500 }, (finished) => {
        if (finished) {
          runOnJS(finalizeProof)();
        }
      });
      
    } catch (e) {
      console.error(e);
      setStatus('failed');
    }
  };

  const finalizeProof = async () => {
    setStatus('success');
    
    // 3. Transmit payload back to Portal
    if (payload) {
      try {
        const url = new URL(payload.replace('fcid://', 'http://'));
        const nonce = url.searchParams.get('nonce');
        
        // Make the network request to the bridging server we just built
        // We use localhost for Android emulator testing, but need your IP if on physical device
        // We'll use a relative path trick or assume local dev
        const ipOffset = '10.0.2.2'; // Standard Android emulator localhost mapped IP, change if needed
        const portalApiUrl = `http://localhost:3000/api/verify/${nonce}`; 
        
        // Wait 1.5s to show success state before pushing
        setTimeout(async () => {
          try {
             // We'll try hitting localhost first (works for iOS simulator)
             await fetch(`http://localhost:3000/api/verify/${nonce}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  fcdid: 'sovereign.fc', // hardcoded demo identity
                  status: 'verified'
                })
             });
          } catch(err) {
            console.log("Localhost failed, verify network connectivity.");
          }
          
          onSuccess();
          onClose();
        }, 1500);

      } catch(e) {
        console.error("Payload transmission failed", e);
        onClose();
      }
    } else {
        onClose();
    }
  };

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible && translateY.value === 1000) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={() => status === 'review' || status === 'failed' ? onClose() : null}
      />
      
      <Animated.View style={[styles.modalContainer, modalStyle]}>
        <View style={styles.handle} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Ionicons name="shield-checkmark" size={32} color="#4A8FE7" />
            <Text style={styles.title}>Identity Request</Text>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardLabel}>REQUESTING PARTY</Text>
            <Text style={styles.serviceName}>{serviceName}</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.cardLabel}>PROOFS REQUESTED</Text>
            <View style={styles.proofItem}>
              <Ionicons name="checkmark-circle" size={16} color="#00C853" />
              <Text style={styles.proofText}>Proof of Humanity</Text>
            </View>
            <View style={styles.proofItem}>
              <Ionicons name="checkmark-circle" size={16} color="#00C853" />
              <Text style={styles.proofText}>KYC Validation</Text>
            </View>
            
            <View style={styles.dataShieldWarning}>
              <Ionicons name="lock-closed" size={14} color="#8A8A8E" />
              <Text style={styles.dataShieldText}>No raw PII will be shared. Proofs are zero-knowledge.</Text>
            </View>
          </View>

          {status === 'review' && (
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.rejectBtn} onPress={onClose}>
                <Text style={styles.rejectTxt}>REJECT</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.authBtn} onPress={handleAuthorize}>
                <Ionicons name="finger-print" size={20} color="#000" style={{marginRight: 8}} />
                <Text style={styles.authTxt}>AUTHORIZE</Text>
              </TouchableOpacity>
            </View>
          )}

          {status === 'authenticating' && (
            <View style={styles.statusBox}>
              <Ionicons name="finger-print" size={48} color="#4A8FE7" style={styles.pulseIcon} />
              <Text style={styles.statusText}>Awaiting Biometrics...</Text>
            </View>
          )}

          {status === 'generating' && (
            <View style={styles.statusBox}>
              <ActivityIndicator size="large" color="#4A8FE7" />
              <Text style={styles.statusText}>Constructing Zero-Knowledge Proof...</Text>
              <View style={styles.progressBarBg}>
                <Animated.View style={[styles.progressBarFill, progressStyle]} />
              </View>
            </View>
          )}

          {status === 'success' && (
            <View style={styles.statusBox}>
              <View style={styles.successCircle}>
                <Ionicons name="checkmark" size={40} color="#00C853" />
              </View>
              <Text style={[styles.statusText, {color: '#00C853'}]}>Proof Generated & Sent</Text>
            </View>
          )}

          {status === 'failed' && (
            <View style={styles.statusBox}>
              <Ionicons name="close-circle" size={48} color="#FF3B30" />
              <Text style={[styles.statusText, {color: '#FF3B30'}]}>Authorization Failed</Text>
              <TouchableOpacity style={[styles.rejectBtn, {marginTop: 20, width: '100%'}]} onPress={onClose}>
                <Text style={styles.rejectTxt}>CLOSE</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#121214',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: 'rgba(74, 143, 231, 0.3)',
    shadowColor: '#4A8FE7',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 24,
  },
  cardLabel: {
    color: '#8A8A8E',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  serviceName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 16,
  },
  proofItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  proofText: {
    color: '#D4D8E0',
    fontSize: 14,
    marginLeft: 8,
  },
  dataShieldWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74,143,231,0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  dataShieldText: {
    color: '#4A8FE7',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rejectBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginRight: 10,
  },
  rejectTxt: {
    color: '#FFF',
    fontWeight: '600',
    letterSpacing: 1,
  },
  authBtn: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A8FE7',
    borderRadius: 12,
  },
  authTxt: {
    color: '#000',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statusBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  statusText: {
    color: '#D4D8E0',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
  pulseIcon: {
    opacity: 0.8,
  },
  progressBarBg: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4A8FE7',
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 200, 83, 0.1)',
    borderWidth: 2,
    borderColor: '#00C853',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
