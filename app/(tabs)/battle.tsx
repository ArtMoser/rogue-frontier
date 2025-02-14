import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

type Character = {
  id: number;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
};

type Enemy = {
  id: number;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
};

export default function BattleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const characterId = Number(params.characterId);
  const level = Number(params.level);
  const battleCount = Number(params.battleCount);

  const [party, setParty] = useState<Character[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'enemy'>('player');
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);

  useEffect(() => {
    // Initialize party based on battle count
    const partySize = Math.min(Math.floor((battleCount - 1) / 5) + 1, 5);
    const newParty = Array(partySize).fill(null).map((_, index) => ({
      id: index,
      name: `Hero ${index + 1}`,
      hp: 100,
      maxHp: 100,
      attack: 15 + Math.floor(level / 2),
      defense: 10 + Math.floor(level / 3)
    }));
    setParty(newParty);

    // Initialize enemies
    const enemyCount = Math.min(Math.floor((battleCount - 1) / 5) + 1, 5);
    const newEnemies = Array(enemyCount).fill(null).map((_, index) => ({
      id: index,
      name: `Enemy ${index + 1}`,
      hp: 80 + level * 5,
      maxHp: 80 + level * 5,
      attack: 12 + Math.floor(level / 2),
      defense: 8 + Math.floor(level / 3)
    }));
    setEnemies(newEnemies);
  }, [battleCount, level]);

  const handleAttack = () => {
    if (selectedCharacter === null || selectedTarget === null) return;

    const attacker = party[selectedCharacter];
    const defender = enemies[selectedTarget];
    const damage = Math.max(1, attacker.attack - defender.defense);

    const updatedEnemies = [...enemies];
    updatedEnemies[selectedTarget] = {
      ...defender,
      hp: Math.max(0, defender.hp - damage)
    };

    setBattleLog(prev => [...prev, `${attacker.name} deals ${damage} damage to ${defender.name}!`]);
    setEnemies(updatedEnemies);
    setCurrentTurn('enemy');
    setSelectedCharacter(null);
    setSelectedTarget(null);

    // Check for victory
    if (updatedEnemies.every(enemy => enemy.hp <= 0)) {
      handleVictory();
    } else {
      // Enemy turn
      setTimeout(enemyTurn, 1000);
    }
  };

  const enemyTurn = () => {
    const livingEnemies = enemies.filter(enemy => enemy.hp > 0);
    const livingParty = party.filter(character => character.hp > 0);

    if (livingEnemies.length === 0 || livingParty.length === 0) return;

    const attacker = livingEnemies[Math.floor(Math.random() * livingEnemies.length)];
    const defender = livingParty[Math.floor(Math.random() * livingParty.length)];
    const damage = Math.max(1, attacker.attack - defender.defense);

    const updatedParty = [...party];
    const defenderIndex = party.findIndex(char => char.id === defender.id);
    updatedParty[defenderIndex] = {
      ...defender,
      hp: Math.max(0, defender.hp - damage)
    };

    setBattleLog(prev => [...prev, `${attacker.name} deals ${damage} damage to ${defender.name}!`]);
    setParty(updatedParty);
    setCurrentTurn('player');

    // Check for defeat
    if (updatedParty.every(character => character.hp <= 0)) {
      handleDefeat();
    }
  };

  const handleVictory = () => {
    if (battleCount % 5 === 0) {
      // Level up and character selection
      router.push({
        pathname: '/character-select',
        params: { 
          level: level + 1,
          isFirstBattle: false
        }
      });
    } else {
      // Next battle
      router.push({
        pathname: '/battle',
        params: {
          characterId,
          level,
          battleCount: battleCount + 1
        }
      });
    }
  };

  const handleDefeat = () => {
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.battleInfo}>Battle {battleCount} - Level {level}</Text>
      
      <View style={styles.battleField}>
        <View style={styles.partyContainer}>
          {party.map((character, index) => (
            <Pressable
              key={character.id}
              style={[
                styles.characterCard,
                currentTurn === 'player' && styles.activeTurn,
                selectedCharacter === index && styles.selected
              ]}
              onPress={() => currentTurn === 'player' && setSelectedCharacter(index)}
            >
              <Text style={styles.characterName}>{character.name}</Text>
              <Text style={styles.characterHp}>HP: {character.hp}/{character.maxHp}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.enemyContainer}>
          {enemies.map((enemy, index) => (
            <Pressable
              key={enemy.id}
              style={[
                styles.enemyCard,
                selectedTarget === index && styles.selected,
                enemy.hp <= 0 && styles.defeated
              ]}
              onPress={() => currentTurn === 'player' && enemy.hp > 0 && setSelectedTarget(index)}
            >
              <Text style={styles.enemyName}>{enemy.name}</Text>
              <Text style={styles.enemyHp}>HP: {enemy.hp}/{enemy.maxHp}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.battleLog}>
        {battleLog.slice(-3).map((log, index) => (
          <Text key={index} style={styles.logText}>{log}</Text>
        ))}
      </View>

      {currentTurn === 'player' && selectedCharacter !== null && selectedTarget !== null && (
        <Pressable style={styles.attackButton} onPress={handleAttack}>
          <Text style={styles.attackButtonText}>Attack!</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  battleInfo: {
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  battleField: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  partyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  enemyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  characterCard: {
    backgroundColor: '#2a2a2a',
    padding: 10,
    borderRadius: 8,
    width: 150,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2a2a2a',
  },
  enemyCard: {
    backgroundColor: '#3a2a2a',
    padding: 10,
    borderRadius: 8,
    width: 150,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3a2a2a',
  },
  selected: {
    borderColor: '#4CAF50',
  },
  defeated: {
    opacity: 0.5,
  },
  activeTurn: {
    backgroundColor: '#2a3a2a',
  },
  characterName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  characterHp: {
    color: '#4CAF50',
    fontSize: 14,
  },
  enemyName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  enemyHp: {
    color: '#ff4444',
    fontSize: 14,
  },
  battleLog: {
    backgroundColor: '#2a2a2a',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    height: 100,
  },
  logText: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 5,
  },
  attackButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  attackButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});