import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FCDID_KEY = 'secure_fcdid_v1';
const ZKP_STATUS_KEY = 'zkp_verified_status';

/**
 * High-Security Enclave Storage (For cryptographic keys, core identity hashes)
 * Uses iOS Keychain / Android Keystore
 */
export const SecureVault = {
  async saveIdentity(fcdid: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(FCDID_KEY, fcdid);
    } catch (e) {
      console.error('Failed to save to SecureStore', e);
    }
  },

  async getIdentity(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(FCDID_KEY);
    } catch (e) {
      console.error('Failed to read from SecureStore', e);
      return null;
    }
  },

  async clearIdentity(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(FCDID_KEY);
    } catch (e) {
      console.error('Failed to delete from SecureStore', e);
    }
  }
};

/**
 * Standard Async Storage (For non-critical data like UI preferences, caching ZKP session flags)
 */
export const LocalCache = {
  async saveZkpSession(status: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(ZKP_STATUS_KEY, JSON.stringify(status));
    } catch (e) {
      console.error('Failed to save ZKP session to AsyncStorage', e);
    }
  },

  async getZkpSession(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(ZKP_STATUS_KEY);
      return value !== null ? JSON.parse(value) : false;
    } catch (e) {
      console.error('Failed to read ZKP session from AsyncStorage', e);
      return false;
    }
  }
};
