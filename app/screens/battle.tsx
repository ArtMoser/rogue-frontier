import { View, Text, StyleSheet, Pressable, Animated, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

import { enemiesTierOne } from '../data/characters';
import HealthBar from "../components/healthBar";

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
  const generalBattleCount = Number(params.generalBattleCount);

  const [party, setParty] = useState<Character[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'enemy'>('player');
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);

  const [swingAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    setParty(team);

    const getRandomEnemies = (enemiesArray, enemyCount) => {
      const shuffled = [...enemiesArray].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, enemyCount);
    };
    
    const enemyCount = team.length;
    setEnemies(getRandomEnemies(enemiesTierOne, enemyCount));

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

    let hasEnemiesAlive = false;
    for(let enemie of updatedEnemies) {
      if(enemie.hp > 0) {
        hasEnemiesAlive = true;
        break;
      }
    }

    for(let teamUnit of partyMembers) {
      if(!teamUnit.attacked && hasEnemiesAlive) {
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
    if (generalBattleCount % 10 === 0 && team.length < 4) {
      // Level up and character selection
      router.push({
        pathname: 'screens/character-select',
        params: { 
          team : JSON.stringify(team),
          level: level + 1,
          isFirstBattle: "false",
          battleCount: battleCount + 1,
          generalBattleCount: generalBattleCount + 1
        }
      });
    } else if (generalBattleCount % 5 === 0) {
      // Level up and upgrade selection
      router.push({
        pathname: 'screens/upgrade-select',
        params: { 
          team : JSON.stringify(team),
          level: level + 1,
          isFirstBattle: "false",
          battleCount: battleCount + 1,
          generalBattleCount: generalBattleCount + 1
        }
      });
    } else {
      // Next battle
      router.push({
        pathname: 'screens/battle',
        params: {
          team : JSON.stringify(team),
          level : level,
          battleCount: battleCount + 1,
          generalBattleCount: generalBattleCount + 1
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
                  selectedTarget === index && styles.selectedEnemy,
                  enemy.hp <= 0 && styles.defeated
                ]}
                onPress={() => currentTurn === 'player' && enemy.hp > 0 && setSelectedTarget(index)}
              >
                <Image source={enemy.image} style={styles.characterImage, styles.enemyImage} />
                <Text style={styles.enemyName}>{enemy.name}</Text>
                <HealthBar hp={enemy.hp} maxHp={enemy.maxHp} isEnemy={true} />
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
                  <Image source={character.image} style={[styles.characterImage]} />
                  <Text style={styles.characterName}>{character.name}</Text>
                  <HealthBar hp={character.hp} maxHp={character.maxHp} isEnemy={false} />
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
                  <Image source={character.image} style={styles.characterImage} />
                  <Text style={styles.characterName}>{character.name}</Text>
                  <HealthBar hp={character.hp} maxHp={character.maxHp} isEnemy={false} />
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
    borderRadius: 8,
    width: 120,
    alignItems: 'center',
  },
  characterImage: {
    width: 120,
    height: 100,
    marginBottom: 10
  },
  enemyCard: {
    borderRadius: 8,
    width: 120,
    alignItems: 'center',
  },
  enemyImage: { 
   transform: [{ scaleX: -1 }]
  },
  selected: {
    borderColor: 'transparent',
    filter: 'drop-shadow(0 0 5px white)'
  },
  selectedEnemy: {
    borderColor: 'transparent',
    filter: 'drop-shadow(0 0 5px red)'
  },
  defeated: {
    opacity: 0.5,
  },
  alreadyAttacked: {
    opacity: 0.5,
  },
  activeTurn: {
    borderColor: '#2a3a2a'
  },
  characterName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  characterHp: {
    color: '#4CAF50',
    fontSize: 14,
  },
  enemyName: {
    color: '#ffffff',
    fontSize: 12,
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