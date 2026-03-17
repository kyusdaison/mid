import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface VerificationResultProps {
  status: 'SUCCESS' | 'FAILED';
  payload?: any;
  onClose: () => void;
}

export default function VerificationResult({ status, payload, onClose }: VerificationResultProps) {
  const isSuccess = status === 'SUCCESS';
  
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <BlurView intensity={90} tint="dark" style={styles.container}>
        <View style={styles.content}>
          
          <View style={styles.iconContainer}>
            <Ionicons 
              name={isSuccess ? "checkmark-circle" : "close-circle"} 
              size={80} 
              color={isSuccess ? "#34C759" : "#FF3B30"} 
            />
          </View>

          <Text style={styles.title}>
            {isSuccess ? 'VERIFICATION SUCCESSFUL' : 'VERIFICATION FAILED'}
          </Text>

          {isSuccess && (
            <LinearGradient
              colors={['rgba(74, 143, 231, 0.1)', 'rgba(0,0,0,0.5)']}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>CREDENTIAL PRESENTATION</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.label}>CREDENTIAL NAME</Text>
                <Text style={styles.value}>Digital Resident ID</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.label}>HOLDER</Text>
                <Text style={styles.value}>VANGUARD</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.label}>ISSUER</Text>
                <Text style={styles.value}>Government of Montserrat</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.label}>VALID UNTIL</Text>
                <Text style={styles.value}>2029-03-17</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.label}>STATUS</Text>
                <Text style={styles.valueSuccess}>VALID</Text>
              </View>
            </LinearGradient>
          )}

          {!isSuccess && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                The scanned credential is invalid, expired, or not recognized by the system.
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.actionButton} onPress={onClose}>
            <Text style={styles.actionButtonText}>DONE</Text>
          </TouchableOpacity>

        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 40,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    padding: 25,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(74, 143, 231, 0.3)',
    marginBottom: 40,
  },
  cardTitle: {
    color: '#4A8FE7',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 20,
    textAlign: 'center',
  },
  detailRow: {
    marginBottom: 15,
  },
  label: {
    color: '#8A8A8E',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  valueSuccess: {
    color: '#34C759',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  errorBox: {
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
    marginBottom: 40,
  },
  errorText: {
    color: '#FF453A',
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 14,
  },
  actionButton: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  }
});
