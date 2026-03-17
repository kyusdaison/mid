import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useWalletStore } from '../store/walletStore';

const mono = Platform.select({ web: '"IBM Plex Mono", monospace', default: Platform.OS === 'ios' ? 'Menlo' : 'monospace' });

export default function AssetList() {
  const assets = useWalletStore((state) => state.assets);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const formatBalance = (num: number) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  
  const formatChange = (num: number) => {
    return (num > 0 ? '+' : '') + num.toFixed(2) + '%';
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>DIGITAL ASSETS</Text>
        <TouchableOpacity onPress={handlePress}>
          <Ionicons name="filter" size={16} color="#7FB3FF" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {assets.map((asset) => (
          <TouchableOpacity key={asset.id} onPress={handlePress} activeOpacity={0.8}>
            <BlurView intensity={20} tint="dark" style={styles.assetRow}>
              {/* Highlight bar for native assets */}
              {asset.symbol === 'MSD' && <View style={styles.nativeHighlight} />}
              
              <View style={[styles.assetIcon, { borderColor: asset.iconColor }]}>
                <View style={[styles.iconInner, { backgroundColor: asset.iconColor }]} />
                <Text style={styles.iconText}>{asset.symbol[0]}</Text>
              </View>
              
              <View style={styles.assetDetails}>
                <Text style={styles.assetName}>{asset.name}</Text>
                <View style={styles.badgeRow}>
                  <Text style={styles.assetSymbol}>{asset.symbol}</Text>
                  {asset.symbol === 'MSD' && (
                    <View style={styles.nativeBadge}>
                      <Text style={styles.nativeBadgeText}>NATIVE</Text>
                    </View>
                  )}
                </View>
              </View>
              
              <View style={styles.assetValues}>
                <Text style={styles.assetBalance}>{formatBalance(asset.balance)}</Text>
                <View style={[styles.changePill, { backgroundColor: asset.change24h > 0 ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 69, 58, 0.1)' }]}>
                  <Ionicons 
                    name={asset.change24h > 0 ? "arrow-up" : "arrow-down"} 
                    size={10} 
                    color={asset.change24h > 0 ? "#34C759" : "#FF453A"} 
                  />
                  <Text style={[styles.assetChange, { color: asset.change24h > 0 ? '#34C759' : '#FF453A' }]}>
                    {formatChange(asset.change24h).replace('+', '').replace('-', '')}
                  </Text>
                </View>
              </View>
            </BlurView>
          </TouchableOpacity>
        ))}
        {/* Spacer at bottom */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  header: {
    color: '#8E98A8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  list: {
    width: '100%',
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 12,
    overflow: 'hidden',
  },
  nativeHighlight: {
    position: 'absolute',
    left: 0,
    top: 10,
    bottom: 10,
    width: 3,
    backgroundColor: '#47C778',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    shadowColor: '#47C778',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  assetIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  iconInner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 22,
    opacity: 0.2,
  },
  iconText: {
    color: '#F4F7FB',
    fontWeight: '800',
    fontSize: 18,
    fontFamily: mono,
  },
  assetDetails: {
    flex: 1,
  },
  assetName: {
    color: '#F4F7FB',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetSymbol: {
    color: '#8E98A8',
    fontSize: 12,
    fontFamily: mono,
    letterSpacing: 1,
  },
  nativeBadge: {
    marginLeft: 8,
    backgroundColor: 'rgba(71, 199, 120, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(71, 199, 120, 0.25)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  nativeBadgeText: {
    color: '#47C778',
    fontSize: 8,
    fontFamily: mono,
    fontWeight: '700',
    letterSpacing: 1,
  },
  assetValues: {
    alignItems: 'flex-end',
  },
  assetBalance: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: mono,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  changePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  assetChange: {
    fontSize: 11,
    fontFamily: mono,
    fontWeight: '700',
    marginLeft: 2,
  }
});
