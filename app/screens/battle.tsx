import { View, Text, StyleSheet, Pressable, Animated, Image } from 'react-native';
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
  const team = JSON.parse(params.team);
  const level = Number(params.level);
  const battleCount = Number(params.battleCount);

  const [party, setParty] = useState<Character[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'enemy'>('player');
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);

  const [swingAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    setParty(team);

    const enemyCount = team.length;
    const newEnemies = Array(enemyCount).fill(null).map((_, index) => ({
      id: index,
      name: `Enemy ${index + 1}`,
      hp: 10 + level * 5,
      maxHp: 10 + level * 5,
      attack: 12 + Math.floor(level / 2),
      defense: 8 + Math.floor(level / 3)
    }));
    setEnemies(newEnemies);

    setCurrentTurn('player');
    setSelectedCharacter(null);
    setSelectedTarget(null);
    setBattleLog([]);
  }, [battleCount, level]);

  useEffect(() => {
    if (selectedCharacter !== null || selectedTarget !== null) {
      swingAnimation.setValue(0); // Reset animation value
      Animated.loop(
        Animated.sequence([
          Animated.timing(swingAnimation, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(swingAnimation, {
            toValue: -1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(swingAnimation, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      swingAnimation.stopAnimation();
      swingAnimation.setValue(0);
    }
  }, [selectedCharacter, selectedTarget]);

  const swing = swingAnimation.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-5deg', '5deg'],
  });

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

    let partyMembers = [... party]
    partyMembers[selectedCharacter].attacked = true;
    setParty(partyMembers);
    

    setBattleLog(prev => [...prev, `${attacker.name} deals ${damage} damage to ${defender.name}!`]);
    setEnemies(updatedEnemies);
    

    swingAnimation.stopAnimation();
    swingAnimation.setValue(0);

    setSelectedCharacter(null);
    setSelectedTarget(null);

    for(let teamUnit of partyMembers) {
      if(!teamUnit.attacked) {
        return;
      }
    }

    setCurrentTurn('enemy');

    if (updatedEnemies.every(enemy => enemy.hp <= 0)) {
      handleVictory();
    } else {
      setTimeout(enemyTurn, 1000);
    }
  };

  const enemyTurn = () => {
    let livingEnemies = enemies.filter(enemy => enemy.hp > 0);
    let livingParty = party.filter(character => character.hp > 0);
  
    if (livingEnemies.length === 0 || livingParty.length === 0) return;
  
    let updatedParty = [...party];
  
    for (let enemy of livingEnemies) {
      if (livingParty.length === 0) break;
  
      let defender = livingParty[Math.floor(Math.random() * livingParty.length)];
      let damage = Math.max(1, enemy.attack - defender.defense);
  
      let defenderIndex = updatedParty.findIndex(char => char.id === defender.id);
  
      if (defenderIndex !== -1) {
        updatedParty[defenderIndex] = {
          ...updatedParty[defenderIndex],
          hp: Math.max(0, updatedParty[defenderIndex].hp - damage),
        };
  
        setBattleLog(prev => [...prev, `${enemy.name} deals ${damage} damage to ${defender.name}!`]);
  
        livingParty = updatedParty.filter(character => character.hp > 0);
      }
    }

    for(let partyMember of updatedParty) {
      partyMember.attacked = false;
    }
  
    setParty(updatedParty);
    setCurrentTurn("player");
  
    // Verifica se todos os personagens foram derrotados
    if (updatedParty.every(character => character.hp <= 0)) {
      handleDefeat();
    }
  };
  

  const handleVictory = () => {
    if (battleCount % 5 === 0) {
      // Level up and character selection
      router.push({
        pathname: 'screens/character-select',
        params: { 
          team : JSON.stringify(team),
          level: level + 1,
          isFirstBattle: "false"
        }
      });
    } else {
      // Next battle
      router.push({
        pathname: 'screens/battle',
        params: {
          team : JSON.stringify(team),
          level : level,
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
        <View style={styles.enemyContainer}>
          {enemies.map((enemy, index) => (
            <Animated.View
              key={enemy.id}
              style={[
                { transform: selectedTarget === index ? [{ rotate: swing }] : [] },
              ]}
            >
              <Pressable
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
            </Animated.View>
          ))}
        </View>

        <View style={styles.partyContainer}>
          {party.map((character, index) => (
            <Animated.View
              key={character.id}
              style={[
                { transform: selectedCharacter === index ? [{ rotate: swing }] : [] },
              ]}
            >
              {character.attacked ? (
                <View style={[styles.characterCard, styles.disabledCharacter]}>
                  <Image source={{ uri: character.image }} style={styles.characterImage} />
                  <Text style={styles.characterName}>{character.name}</Text>
                  <Text style={styles.characterHp}>HP: {character.hp}/{character.maxHp}</Text>
                </View>
              ) : (
                <Pressable
                  style={[
                    styles.characterCard,
                    currentTurn === 'player' && styles.activeTurn,
                    selectedCharacter === index && styles.selected
                  ]}
                  onPress={() => currentTurn === 'player' && setSelectedCharacter(index)}
                >
                  <Image source={{ uri: character.image }} style={styles.characterImage} />
                  <Text style={styles.characterName}>{character.name}</Text>
                  <Text style={styles.characterHp}>HP: {character.hp}/{character.maxHp}</Text>
                </Pressable>
              )}
            </Animated.View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  partyContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  enemyContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
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
  characterImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
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
  alreadyAttacked: {
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