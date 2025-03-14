import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const BattleInfo = ({ turnDamage, turnNumber }) => {
  const [color, setColor] = useState('#FFFFFF');
  const [fontSize, setFontSize] = useState(16);
  const [shadowColor, setShadowColor] = useState('transparent');

  const [turnNumberColor, setTurnNumberColor] = useState('#FFFFFF');
  const [turnNumberFontSize, setTurnNumberFontSize] = useState(16);
  const [turnNumberShadowColor, setTurnNumberShadowColor] = useState('transparent');

  const scaleValue = useRef(new Animated.Value(1)).current;
  const shakeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Define cor e efeitos com base no dano
    if (turnDamage > 20000) {
      setColor('#FFD700'); // Dourado neon
      setShadowColor('#FFA500'); // Sombra laranja
      setFontSize(36);
    } else if (turnDamage > 10000) {
      setColor('#00FFFF'); // Ciano neon
      setShadowColor('#00CED1'); // Sombra azul-claro
      setFontSize(32);
    } else if (turnDamage > 5000) {
      setColor('#FF1493'); // Rosa neon
      setShadowColor('#FF69B4'); // Sombra rosa-claro
      setFontSize(28);
    } else if (turnDamage > 2000) {
      setColor('#8A2BE2'); // Roxo intenso
      setShadowColor('#9400D3'); // Roxo escuro
      setFontSize(24);
    } else if (turnDamage > 1000) {
      setColor('#FF4500'); // Vermelho forte
      setShadowColor('#DC143C'); // Vermelho escuro
      setFontSize(20);
    } else if (turnDamage > 500) {
      setColor('#FFD700'); // Amarelo ouro
      setShadowColor('#DAA520'); // Amarelo escuro
      setFontSize(18);
    } else {
      setColor('#FFFFFF'); // Branco normal
      setShadowColor('transparent'); // Sem sombra
      setFontSize(16);
    }

    startScaleAnimation();
    if (turnDamage > 2000) {
      startShakeAnimation();
    }
  }, [turnDamage]);

  useEffect(() => {
    // Define cor e efeitos com base no dano
    if (turnNumber > 85) {
      setTurnNumberColor('#FFD700'); // Dourado neon
      setTurnNumberShadowColor('#FFA500'); // Sombra laranja
      setTurnNumberFontSize(36);
    } else if (turnNumber > 75) {
      setTurnNumberColor('#00FFFF'); // Ciano neon
      setTurnNumberShadowColor('#00CED1'); // Sombra azul-claro
      setTurnNumberFontSize(32);
    } else if (turnNumber > 65) {
      setTurnNumberColor('#FF1493'); // Rosa neon
      setTurnNumberShadowColor('#FF69B4'); // Sombra rosa-claro
      setTurnNumberFontSize(28);
    } else if (turnNumber > 45) {
      setTurnNumberColor('#8A2BE2'); // Roxo intenso
      setTurnNumberShadowColor('#9400D3'); // Roxo escuro
      setTurnNumberFontSize(24);
    } else if (turnNumber > 25) {
      setTurnNumberColor('#FF4500'); // Vermelho forte
      setTurnNumberShadowColor('#DC143C'); // Vermelho escuro
      setTurnNumberFontSize(20);
    } else if (turnNumber > 15) {
      setTurnNumberColor('#FFD700'); // Amarelo ouro
      setTurnNumberShadowColor('#DAA520'); // Amarelo escuro
      setTurnNumberFontSize(18);
    } else {
      setTurnNumberColor('#FFFFFF'); // Branco normal
      setTurnNumberShadowColor('transparent'); // Sem sombra
      setTurnNumberFontSize(16);
    }
  }, [turnNumber]);

  const startScaleAnimation = () => {
    scaleValue.setValue(1);
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startShakeAnimation = () => {
    shakeValue.setValue(0);
    Animated.sequence([
      Animated.timing(shakeValue, { toValue: 5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeValue, { toValue: -5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeValue, { toValue: 5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeValue, { toValue: -5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeValue, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.battleInfo}>DMG: </Text>
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              transform: [{ scale: scaleValue }, { translateX: shakeValue }],
            },
          ]}
        >
          <Text style={[styles.damageText, { color, fontSize, textShadowColor: shadowColor, textShadowRadius: 5 }]}>
            {Math.floor(turnDamage)}
          </Text>
        </Animated.View>
      </View>
      <View style={styles.turnNumberPositioning}>
        <Text style={[{color: '#ffffff', fontSize: turnNumberFontSize}]}>Battle Number: </Text>
        <Text style={[styles.turnNumber, styles.damageText, { color: turnNumberColor, fontSize: turnNumberFontSize, textShadowColor: turnNumberShadowColor, textShadowRadius: 5 }]}>
          {Math.floor(turnNumber)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  turnNumberPositioning: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  turnNumber: {
    paddingTop: 10
  },
  battleInfo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  animatedContainer: {
    marginLeft: 5,
  },
  damageText: {
    fontWeight: 'bold',
    textShadowOffset: { width: 1, height: 1 }, // Pequena sombra para impacto
  },
});

export default BattleInfo;
