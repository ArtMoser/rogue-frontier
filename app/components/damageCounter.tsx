import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

const DamageCounter = ({ damage, position }) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação: sobe e desaparece
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -50, // Move o texto para cima
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0, // Desaparece gradualmente
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.Text
      style={[
        styles.damageText,
        {
          opacity,
          transform: [{ translateY }],
          top: position.top, // Posiciona o texto acima do inimigo
          left: position.left,
        },
      ]}
    >
      -{damage}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  damageText: {
    position: 'absolute',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default DamageCounter;