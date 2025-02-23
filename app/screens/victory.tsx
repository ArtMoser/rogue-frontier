import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, ImageBackground } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function VictoryScreen() {
  const router = useRouter();

  const params = useLocalSearchParams();
  let team = JSON.parse(decodeURIComponent(params.team));
  const level = Number(params.level);
  const battleCount = Number(params.battleCount);
  const generalBattleCount = Number(params.generalBattleCount);
debugger;
  // Animação de fade-in para o texto
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Animação de fade-in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Duração de 1 segundo
      useNativeDriver: true,
    }).start();

    // Redireciona para a tela de batalha após 2 segundos
    const timeout = setTimeout(() => {
      router.push({
        pathname: 'screens/battle',
        params: {
          team: JSON.stringify(team),
          level: level,
          battleCount: battleCount + 1,
          generalBattleCount: generalBattleCount + 1,
          isBossBattle: false
        },
      });
    }, 2000); // 2 segundos

    // Limpa o timeout ao desmontar o componente
    return () => clearTimeout(timeout);
  }, [generalBattleCount]);

  return (
      <ImageBackground
        source={require('../assets/misc/boss-defeat.jpg')}
        style={styles.container}
        resizeMode="cover" // ou "contain", conforme sua necessidade
      >
        <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
          Boss Defeated!
        </Animated.Text>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white', // Texto dourado
    textShadowColor: 'rgba(255, 215, 0, 0.5)', // Sombra dourada
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
});