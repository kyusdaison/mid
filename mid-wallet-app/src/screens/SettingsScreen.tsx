import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWalletStore } from '../store/walletStore';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const mono = Platform.select({ web: '"IBM Plex Mono", monospace', default: Platform.OS === 'ios' ? 'Menlo' : 'monospace' });

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const resetWallet = useWalletStore((state) => state.resetWallet);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleReset = () => {
    Alert.alert(
      'Reset Identity',
      'This will remove your Digital Resident ID from this device. You will need to re-import your credentials to access your account. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Erase Device', 
          style: 'destructive',
          onPress: () => {
            resetWallet();
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={['rgba(77, 124, 254, 0.05)', '#04060A']} style={StyleSheet.absoluteFillObject} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SYSTEM CONFIG</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Text style={styles.sectionTitle}>SECURITY</Text>
        <BlurView intensity={20} tint="dark" style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(71, 199, 120, 0.15)' }]}>
                <Ionicons name="finger-print" size={20} color="#47C778" />
              </View>
              <Text style={styles.settingLabel}>Biometric Unlock</Text>
            </View>
            <Switch 
              value={biometricsEnabled} 
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#47C778' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(77, 124, 254, 0.15)' }]}>
                <Ionicons name="notifications" size={20} color="#4D7CFE" />
              </View>
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <Switch 
              value={notificationsEnabled} 
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#47C778' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </BlurView>

        <Text style={styles.sectionTitle}>NETWORK</Text>
        <BlurView intensity={20} tint="dark" style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(255, 255, 255, 0.05)' }]}>
                <Ionicons name="git-network" size={20} color="#D4D8E0" />
              </View>
              <Text style={styles.settingLabel}>Active Node</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>prc.run (Mainnet)</Text>
              <Ionicons name="chevron-forward" size={16} color="#7E8BA0" />
            </View>
          </TouchableOpacity>
        </BlurView>

        <Text style={styles.sectionTitle}>SYSTEM</Text>
        <BlurView intensity={20} tint="dark" style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(138, 138, 142, 0.15)' }]}>
                <Ionicons name="information" size={20} color="#8A8A8E" />
              </View>
              <Text style={styles.settingLabel}>App Version</Text>
            </View>
            <Text style={styles.versionText}>1.0.0-rc.3</Text>
          </View>
        </BlurView>

        <View style={styles.dangerZone}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <LinearGradient
              colors={['rgba(255, 59, 48, 0.15)', 'rgba(255, 59, 48, 0.05)']}
              style={StyleSheet.absoluteFillObject}
            />
            <Ionicons name="warning-outline" size={20} color="#FF453A" style={{ marginRight: 8 }} />
            <Text style={styles.resetButtonText}>ERASE IDENTITY DATA</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerNote}>
          MID WALLET OS // BUILD 42
        </Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#04060A',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#D4D8E0',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    fontFamily: mono,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  sectionTitle: {
    color: '#7E8BA0',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 10,
    marginTop: 24,
    fontFamily: mono,
  },
  settingsCard: {
    backgroundColor: 'rgba(10, 15, 23, 0.6)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginLeft: 56,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  settingLabel: {
    color: '#F4F7FB',
    fontSize: 15,
    fontWeight: '500',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingValue: {
    color: '#D4D8E0',
    fontSize: 14,
  },
  versionText: {
    color: '#8A8A8E',
    fontSize: 14,
    fontFamily: mono,
  },
  dangerZone: {
    marginTop: 40,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  resetButtonText: {
    color: '#FF453A',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  footerNote: {
    textAlign: 'center',
    color: '#7E8BA0',
    opacity: 0.6,
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 50,
    fontFamily: mono,
  }
});
