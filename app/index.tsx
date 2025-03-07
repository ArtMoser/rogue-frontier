import { View, Text, StyleSheet, Pressable, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

export default function StartScreen() {
  const router = useRouter();
  const [sound, setSound] = useState();

  const playSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    let soundFile = require('./assets/sounds/bf001_title.mp3');

    const { sound: newSound } = await Audio.Sound.createAsync(soundFile, { isLooping: true });
    setSound(newSound);

    await newSound.setVolumeAsync(0.05);
    await newSound.playAsync();
  }

  useEffect(() => {
      playSound();
  }, []);

  const startGame = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
    router.push({
      pathname: 'screens/character-select',
      params: { 
        level: 1, 
        isFirstBattle: true,
        generalBattleCount: 0,
        battleCount: 0
      },
    });
  };

  return (
    <ImageBackground
      source={require('../app/assets/menu/menu-background.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Pressable style={styles.startButton} onPress={startGame}>
          <ImageBackground
            source={require('../app/assets/misc/title_msg.png')}
            style={styles.buttonBackground}
            resizeMode="cover"
          >
            {/*<Text style={styles.startButtonText}>Start Journey</Text>*/}
          </ImageBackground>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textShadowColor: '#4CAF50',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 20,
    color: '#4CAF50',
    marginBottom: 40,
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 15,
    marginBottom: 40,
  },
  startButton: {
    width: 400,
    height: 60,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});