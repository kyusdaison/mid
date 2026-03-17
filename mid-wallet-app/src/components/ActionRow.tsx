import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const mono = Platform.select({ web: '"IBM Plex Mono", monospace', default: Platform.OS === 'ios' ? 'Menlo' : 'monospace' });

export default function ActionRow() {
  const navigation = useNavigation<any>();

  const handlePress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(route);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.actionBtn} onPress={() => handlePress('History')}>
        <View style={styles.iconPlaceholder}>
          <Ionicons name="arrow-down" size={20} color="#4A8FE7" />
        </View>
        <Text style={styles.actionText}>Receive</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.actionBtn} onPress={() => handlePress('Transfer')}>
        <View style={styles.iconPlaceholder}>
          <Ionicons name="arrow-up" size={20} color="#4A8FE7" />
        </View>
        <Text style={styles.actionText}>Send</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionBtn} onPress={() => handlePress('Verify')}>
        <View style={styles.iconPlaceholder}>
          <Ionicons name="scan" size={20} color="#4A8FE7" />
        </View>
        <Text style={styles.actionText}>Scan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
  },
  actionBtn: {
    alignItems: 'center',
    flex: 1,
  },
  iconPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 143, 231, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(74, 143, 231, 0.3)',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    color: '#4A8FE7',
    fontSize: 11,
    fontFamily: mono,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  }
});
