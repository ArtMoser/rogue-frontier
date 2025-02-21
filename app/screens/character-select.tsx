import React, { useCallback, useMemo } from 'react'; // Adicione useMemo
import { View, Text, StyleSheet, Pressable, Image, ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { characters } from '../data/characters';
import { useFocusEffect } from '@react-navigation/native';

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
  const team = useMemo(() => params.team ? JSON.parse(params.team) : [], [params.team]); // Memorize team
  const isFirstBattle = params.isFirstBattle === 'true';
  const generalBattleCount = Number(params.generalBattleCount);

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [availableCharacters, setAvailableCharacters] = useState<Character[]>(characters);

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
  };

  // Corrigido: use useCallback para encapsular a função
  useFocusEffect(
    useCallback(() => {
      debugger;
      const getRandomCharacters = () => {
        let filteredCharacters = characters;

        if (team.length > 0) {
          filteredCharacters = characters.filter(charItem =>
            !team.some(teamMember => teamMember.id === charItem.id)
          );
        }

        const shuffled = [...filteredCharacters].sort();
        return shuffled.slice(0, 3);
      };

      setAvailableCharacters(getRandomCharacters());
    }, [team]) // Dependências do useCallback
  );

  const handleConfirm = () => {
    if (selectedCharacter) {
      const updatedTeam = [...team, selectedCharacter]; // Crie um novo array para evitar mutação direta

      router.push({
        pathname: 'screens/battle',
        params: {
          team: JSON.stringify(updatedTeam),
          level: level,
          battleCount: isFirstBattle ? 1 : Math.floor((level - 1) / 5) * 5 + 1,
          generalBattleCount: isFirstBattle ? 1 : generalBattleCount
        }
      });
    }
  };

  return (
    <ImageBackground
      source={require('../assets/upgrades/area_sp.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Choose Your Hero</Text>
        <Text style={styles.subtitle}>Level {level} Adventure</Text>

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
              <Text style={styles.characterType}>{character.type}</Text>
              <View style={styles.statsContainer}>
                <Text style={styles.statText}>HP: {character.hp}</Text>
                <Text style={styles.statText}>ATK: {character.attack}</Text>
                <Text style={styles.statText}>DEF: {character.defense}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {selectedCharacter && (
          <Pressable style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Begin Battle</Text>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#4CAF50',
    marginBottom: 30,
  },
  charactersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  characterCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 15,
    width: 100,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2a2a2a',
    marginTop: "35%"
  },
  selectedCharacter: {
    borderColor: '#4CAF50',
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
  characterType: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 10,
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
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});