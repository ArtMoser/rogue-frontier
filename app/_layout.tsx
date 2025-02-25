import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Animated } from 'react-native';
import { useEffect, useRef } from 'react';

export default function RootLayout() {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animação de fade ao trocar de tela
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="screens" options={{ headerShown: false }} />
        <Stack.Screen name="battle" options={{ headerShown: false }} />
        <Stack.Screen name="character-select" options={{ headerShown: false }} />
        <Stack.Screen name="upgrade-select" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </Animated.View>
  );
}