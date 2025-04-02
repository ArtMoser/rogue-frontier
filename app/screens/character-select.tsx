import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { characters } from '../data/characters';
import { useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';

type Character = {
  id: number;
  name: string;
  type: string;
  hp: number;
  attack: number;
  defense: number;
  image: string;
};

export default function CharacterSelectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const level = Number(params.level);
  const team = useMemo(() => params.team ? JSON.parse(decodeURIComponent(params.team)) : [], [params.team]); // Memorize team
  const isFirstBattle = params.isFirstBattle === 'true';
  const generalBattleCount = Number(params.generalBattleCount);
  const battleCount = Number(params.battleCount);

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [availableCharacters, setAvailableCharacters] = useState<Character[]>([]);
  const [sound, setSound] = useState();
  const [rerollQuantity, setRerollQuantity] = useState<Number | 0>(3);

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
    playSound();
  };

  const playSound = async (type) => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    let soundFile = require('../assets/sounds/bf300_se_action.mp3');
    const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
    setSound(newSound);

    await newSound.setVolumeAsync(0.1);
    await newSound.playAsync();
  }

  const getRandomCharacters = () => {
    const shuffleList = (array) => {
      let currentIndex = array.length, randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }
    
      return array;
    }

    const deepCopyCharacters = (characters) => {
      return characters.map(character => ({
        ...character,
        hp: character.hp,
        maxHp: character.maxHp,
        attack: character.attack,
        defense: character.defense,
      }));
    };

    let filteredCharacters = deepCopyCharacters(characters); 

    if (team.length > 0) {
        filteredCharacters = filteredCharacters.filter(charItem =>
            !team.some(teamMember => teamMember.id === charItem.id)
        );
    }

    const shuffled = shuffleList([...filteredCharacters]);

    if (generalBattleCount > 1) {
        let scaleFactor = 1 + Math.log(generalBattleCount + 1) * 0.6;

        for (let character of shuffled) {
            character.hp = Math.floor(character.hp * scaleFactor);
            character.maxHp = Math.floor(character.maxHp * scaleFactor);
            character.attack = Math.floor(character.attack * scaleFactor);
            character.defense = Math.floor(character.defense * scaleFactor);
        }
    }

    return shuffled.slice(0, 3);
};

  useFocusEffect(
    useCallback(() => {
      setRerollQuantity(3);
      setAvailableCharacters(getRandomCharacters());
    }, [team])
  );

  const handleReroll = () => {    
    let currentRerollQuantity = rerollQuantity;

    setSelectedCharacter(null);
    setRerollQuantity(currentRerollQuantity - 1);
    setAvailableCharacters(getRandomCharacters());
  }

  const handleConfirm = () => {
    playSound();
    if (selectedCharacter) {
      const updatedTeam = [...team];
      updatedTeam.push(selectedCharacter);

      setSelectedCharacter(null);

      router.push({
        pathname: 'screens/battle',
        params: {
          team: encodeURIComponent(JSON.stringify(updatedTeam)),
          level: level,
          battleCount: isFirstBattle ? 1 : (battleCount + 1),
          generalBattleCount: isFirstBattle ? 1 : (generalBattleCount + 1),
          isFirstBattle: isFirstBattle,
          isBossBattle: false
        }
      });
    }
  };

  const handleCancel = () => {
    playSound();
    setSelectedCharacter(null);

    router.push({
      pathname: 'screens/battle',
      params: {
        team: encodeURIComponent(JSON.stringify(team)),
        level: level,
        battleCount: isFirstBattle ? 1 : (battleCount + 1),
        generalBattleCount: isFirstBattle ? 1 : (generalBattleCount + 1),
        isFirstBattle: isFirstBattle,
        isBossBattle: false
      }
    });
  };

  function getTargetType(character) {
    if (character.attackType == 'multiTarget') {
        return "Multi target";
    }
    return "Single target";
  }

  return (
    <ImageBackground
      source={require('../assets/misc/base.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Choose Your Hero</Text>

        <View style={styles.charactersContainer}>
          {availableCharacters.map((character) => (
            <Pressable
              key={character.id}
              style={[
                styles.characterCard,
                selectedCharacter?.id === character.id && styles.selectedCharacter
              ]}
              onPress={() => handleCharacterSelect(character)}
            >
              <Image source={character.image} style={styles.characterImage} />
              <Text style={styles.characterName}>{character.name}</Text>
              <View style={styles.statsContainer}>
                <Text style={styles.statText}>
                  {getTargetType(character)}
                </Text>
                <Text style={styles.statText}>HP: {character.hp}</Text>
                <Text style={styles.statText}>ATK: {character.attack}</Text>
                <Text style={styles.statText}>DEF: {character.defense}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {rerollQuantity >= 1 && (
          <Pressable style={styles.rerollButton} onPress={handleReroll}>
              <ImageBackground
                source={require('../assets/misc/sub_sss_arrow_right_btn1.png')}
                style={styles.reroll}
                resizeMode="cover"
              >
                <Text style={styles.rerollButtonText}>Reroll ({rerollQuantity}) </Text>
              </ImageBackground>
          </Pressable>
        )}

        {selectedCharacter && (
          <Pressable style={styles.confirmButton} onPress={handleConfirm}>
            <ImageBackground
              source={require('../assets/misc/ok_btn1.png')}
              style={styles.okButton}
              resizeMode="cover"
            >
            </ImageBackground>
          </Pressable>
        )}

        {generalBattleCount > 1 && (
          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <ImageBackground
              source={require('../assets/misc/cancel-button.png')}
              style={styles.cancelButtonBackground}
              resizeMode="cover"
            >
            </ImageBackground>
          </Pressable>
        )}
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
  rerollButton: {
    position: 'absolute',
    top: 150,
    right: 0,
  },
  reroll: {
    width: 90,
    height: 50,
    justifyContent: 'center'
  },
  rerollButtonText: {
    width: '80%',
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold'
  },
  okButton: {
    width: 150,
    height: 60,
    marginTop: 30,
  },
  cancelButton: {
    position: 'absolute', // Posiciona o botão de forma absoluta
    bottom: 20, // Coloca o botão no canto inferior da tela
    alignSelf: 'center', // Centraliza horizontalmente
  },
  cancelButtonBackground: {
    width: 150,
    height: 60,
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
    gap: 20,
    marginBottom: 30,
  },
  characterCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
    padding: 15,
    width: 100,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2a2a2a',
    marginTop: "35%"
  },
  selectedCharacter: {
    borderColor: 'rgba(255, 255, 255, 0.7)',
    transform: [{ scale: 1.05 }],
  },
  characterImage: {
    borderRadius: 50,
    marginBottom: 10,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  statsContainer: {
    alignItems: 'center',
  },
  statText: {
    color: '#cccccc',
    fontSize: 12,
    marginBottom: 2,
  },
  confirmButton: {
    marginTop: 20,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});