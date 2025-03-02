import { View, Text, StyleSheet, Pressable, Image, ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

export default function UpgradeSelectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const level = Number(params.level);
  const isWin = params.isWin === 'true';
  const characterHistory = JSON.parse(decodeURIComponent(params.characterHistory));
  const generalBattleCount = Number(params.generalBattleCount);

  const [sound, setSound] = useState();

  const playSound = async (type) => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    let soundFile = require('../assets/sounds/bf001_title.mp3');
    const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
    setSound(newSound);

    await newSound.setVolumeAsync(0.1);
    await newSound.playAsync();
  };

  async function stopSounds() {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
  }

  useEffect(() => {
    playSound();
  }, []);

  const handleConfirm = () => {
    stopSounds();
    router.push('/');
  };

  return (
    <ImageBackground
      source={isWin ? require('../assets/misc/base-win.jpg') : require('../assets/misc/base-defeat.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {isWin 
        ?
          <Text style={styles.title}>YOU WIN</Text>
        :
          <Text style={styles.defeat}>Defeat</Text>
        }
        <View style={styles.charactersContainer}>
          {characterHistory.map((character, index) => (
            <View key={character.id + '-' + index} style={styles.characterCard}>
              {character.isDefeated 
              ? 
              <Image resizeMode="contain" style={styles.defeatedImage} source={require('../assets/misc/battle_dead.png')} />
              :
              <Text style="position: absolute"></Text>
              }
              <Image resizeMode="contain" style={styles.characterImage} source={character.image} />
            </View>
          ))}
        </View>
        
        <Pressable style={styles.confirmButton} onPress={handleConfirm}>
          <ImageBackground
            source={require('../assets/misc/ok_btn1.png')}
            style={styles.okButton}
            resizeMode="cover"
          > 
          </ImageBackground>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  defeatedImage: {
    width: 50,
    position: 'absolute',
    zIndex: 20,
    top: 10,
  },
  okButton: {
    width: 150,
    height: 60,
    marginTop: 30,
  },
  defeat: {
    color: '#70030c',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 40,
    marginBottom: 10,
    
  },
  charactersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30%',
  },
  characterCard: {
    marginLeft: -50,
    borderRadius: 15,
    padding: 15,
    width: 100,
    alignItems: 'center',
  },
  characterImage: {
    width: 100,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});