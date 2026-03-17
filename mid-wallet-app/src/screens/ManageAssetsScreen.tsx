import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const mono = Platform.select({ web: '"IBM Plex Mono", monospace', default: Platform.OS === 'ios' ? 'Menlo' : 'monospace' });

const TOKENS = [
  { id: 'msd', name: 'Montserrat Dollar', symbol: 'MSD', iconName: 'M', color: '#4D7CFE', isNative: true, defaultEnabled: true },
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', iconName: 'logo-bitcoin', color: '#F7931A', isNative: false, defaultEnabled: true },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', iconName: 'logo-stencil', color: '#627EEA', isNative: false, defaultEnabled: true },
  { id: 'usdc', name: 'USD Coin', symbol: 'USDC', iconName: '$', color: '#2775CA', isNative: false, defaultEnabled: true },
  { id: 'sol', name: 'Solana', symbol: 'SOL', iconName: 'aperture-outline', color: '#14F195', isNative: false, defaultEnabled: false },
  { id: 'link', name: 'Chainlink', symbol: 'LINK', iconName: 'link-outline', color: '#2A5ADA', isNative: false, defaultEnabled: false },
  { id: 'uni', name: 'Uniswap', symbol: 'UNI', iconName: 'planet-outline', color: '#FF007A', isNative: false, defaultEnabled: false },
];

export default function ManageAssetsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [toggles, setToggles] = useState<Record<string, boolean>>(
    TOKENS.reduce((acc, t) => ({ ...acc, [t.id]: t.defaultEnabled }), {})
  );

  const toggleSwitch = (id: string, isNative: boolean) => {
    if (isNative) return; // Cannot disable native token
    setToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={['rgba(77, 124, 254, 0.05)', '#04060A']} style={StyleSheet.absoluteFillObject} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#D4D8E0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MANAGE ASSETS</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={20} color="#4D7CFE" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
           <Ionicons name="information-circle-outline" size={16} color="#8A8A8E" style={{marginRight: 8}}/>
           <Text style={styles.infoText}>Toggle visibility for digital assets on your dashboard. Native sovereign assets cannot be hidden.</Text>
        </View>

        <View style={styles.listContainer}>
          {TOKENS.map((token, index) => (
            <BlurView intensity={20} tint="dark" style={styles.tokenRow} key={token.id}>
              <View style={styles.tokenLeft}>
                <View style={[styles.iconBox, { backgroundColor: token.color }]}>
                  {token.iconName.length === 1 || token.iconName === '$' ? (
                    <Text style={styles.iconText}>{token.iconName}</Text>
                  ) : (
                    <Ionicons name={token.iconName as any} size={18} color="#FFF" />
                  )}
                </View>
                <View>
                  <Text style={styles.tokenName}>{token.name}</Text>
                  <View style={styles.symbolRow}>
                    <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                    {token.isNative && (
                      <View style={styles.nativeBadge}>
                        <Text style={styles.nativeBadgeText}>NATIVE</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              <Switch
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(77, 124, 254, 0.5)' }}
                thumbColor={toggles[token.id] ? '#4D7CFE' : '#8A8A8E'}
                ios_backgroundColor="rgba(255,255,255,0.1)"
                onValueChange={() => toggleSwitch(token.id, token.isNative)}
                value={toggles[token.id]}
                disabled={token.isNative}
              />
            </BlurView>
          ))}
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
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(77, 124, 254, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(77, 124, 254, 0.2)',
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
    paddingBottom: 40,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  infoText: {
    color: '#8A8A8E',
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
  listContainer: {
    gap: 12,
  },
  tokenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(77, 124, 254, 0.1)',
    overflow: 'hidden',
    backgroundColor: 'rgba(10, 15, 23, 0.5)',
  },
  tokenLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tokenName: {
    color: '#F4F7FB',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  symbolRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenSymbol: {
    color: '#7E8BA0',
    fontSize: 12,
    fontFamily: mono,
  },
  nativeBadge: {
    backgroundColor: 'rgba(71, 199, 120, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(71, 199, 120, 0.3)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  nativeBadgeText: {
    color: '#47C778',
    fontSize: 8,
    fontFamily: mono,
    fontWeight: '700',
    letterSpacing: 0.5,
  }
});
