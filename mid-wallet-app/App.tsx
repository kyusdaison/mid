import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { IdentityProvider, useIdentity } from './src/context/IdentityContext';

// Screens
import LockScreen from './src/screens/LockScreen';
import WalletScreen from './src/screens/WalletScreen';
import VerifyScreen from './src/screens/VerifyScreen';
import TransactionHistoryScreen from './src/screens/TransactionHistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TransferScreen from './src/screens/TransferScreen';
import ReceiveScreen from './src/screens/ReceiveScreen';
import BuyScreen from './src/screens/BuyScreen';
import SwapScreen from './src/screens/SwapScreen';
import ManageAssetsScreen from './src/screens/ManageAssetsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: 'rgba(255,255,255,0.05)',
          borderTopWidth: 1,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: '#4A8FE7',
        tabBarInactiveTintColor: '#8A8A8E',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Verify') iconName = focused ? 'qr-code' : 'qr-code-outline';
          else if (route.name === 'History') iconName = focused ? 'time' : 'time-outline';
          else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={WalletScreen} />
      <Tab.Screen name="Verify" component={VerifyScreen} />
      <Tab.Screen name="History" component={TransactionHistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// Root navigator reads identity state and routes accordingly
function RootNavigator() {
  const { isZkpVerified } = useIdentity();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {isZkpVerified ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="Transfer" component={TransferScreen} />
          <Stack.Screen name="Receive" component={ReceiveScreen} />
          <Stack.Screen name="Buy" component={BuyScreen} />
          <Stack.Screen name="Swap" component={SwapScreen} />
          <Stack.Screen name="ManageAssets" component={ManageAssetsScreen} />
        </>
      ) : (
        <Stack.Screen name="Lock" component={LockScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <IdentityProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <RootNavigator />
      </NavigationContainer>
    </IdentityProvider>
  );
}
