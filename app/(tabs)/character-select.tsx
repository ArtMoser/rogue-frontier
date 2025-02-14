import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

type Character = {
  id: number;
  name: string;
  type: string;
  hp: number;
  attack: number;
  defense: number;
  image: string;
};

const characters: Character[] = [
  {
    id: 1,
    name: 'Warrior',
    type: 'Melee',
    hp: 100,
    attack: 15,
    defense: 10,
    image: 'https://images.unsplash.com/photo-1594207691760-5d027b11f416?q=80&w=200'
  },
  {
    id: 2,
    name: 'Mage',
    type: 'Magic',
    hp: 70,
    attack: 20,
    defense: 5,
    image: 'https://images.unsplash.com/photo-1577963196272-65f3e138dc54?q=80&w=200'
  },
  {
    id: 3,
    name: 'Rogue',
    type: 'Agility',
    hp: 80,
    attack: 18,
    defense: 7,
    image: 'https://images.unsplash.com/photo-1612404730960-5c71577fca11?q=80&w=200'
  }
];

export default function CharacterSelectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const level = Number(params.level);
  const isFirstBattle = params.isFirstBattle === 'true';
  
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleConfirm = () => {
    if (selectedCharacter) {
      router.push({
        pathname: '/battle',
        params: {
          characterId: selectedCharacter.id,
          level: level,
          battleCount: isFirstBattle ? 1 : Math.floor((level - 1) / 5) * 5 + 1
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Hero</Text>
      <Text style={styles.subtitle}>Level {level} Adventure</Text>
      
      <View style={styles.charactersContainer}>
        {characters.map((character) => (
          <Pressable
            key={character.id}
            style={[
              styles.characterCard,
              selectedCharacter?.id === character.id && styles.selectedCharacter
            ]}
            onPress={() => handleCharacterSelect(character)}
          >
            <Image source={{ uri: character.image }} style={styles.characterImage} />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
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
    width: 100,
    height: 100,
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
});