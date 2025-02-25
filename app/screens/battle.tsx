import { View, Text, StyleSheet, Pressable, Animated, ImageBackground, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { ActivityIndicator } from 'react-native';

import { upgrades } from '../data/upgrades';
import { enemiesTierOne } from '../data/enemies';
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
  let team = JSON.parse(decodeURIComponent(params.team));
  const level = Number(params.level);
  const battleCount = Number(params.battleCount);
  const generalBattleCount = Number(params.generalBattleCount);
  const isBossBattle = (params.isBossBattle == 'false' || params.isBossBattle == 'true') ? JSON.parse(params.isBossBattle): false;

  const [party, setParty] = useState<Character[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'enemy'>('player');
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [turnMessage, setTurnMessage] = useState('');
  const [turnNumber, setTurnNumber] = useState<number | null>(1);

  const [swingAnimation] = useState(new Animated.Value(0));
  const [characterMoveAnimations, setCharacterMoveAnimations] = useState<Animated.Value[]>([]);
  const [enemyShakeAnimations, setEnemyShakeAnimations] = useState<Animated.Value[]>([]);
  const [enemyMoveAnimations, setEnemyMoveAnimations] = useState<Animated.Value[]>([]);
  const [characterShakeAnimations, setCharacterShakeAnimations] = useState<Animated.Value[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const attackTimeouts = useRef<Record<number, NodeJS.Timeout>>({});

  const slideAnim = useRef(new Animated.Value(0)).current;

  const startSlideAnimation = (callback: () => void) => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        callback();
      }, 100);
    });
  };

  const shakeCharacter = (index: number) => {
    Animated.sequence([
      Animated.timing(characterShakeAnimations[index], {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(characterShakeAnimations[index], {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(characterShakeAnimations[index], {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const performEnemyAttackAnimation = () => {
    const livingEnemies = enemies.filter(enemy => enemy.hp > 0);
    Animated.parallel(
      livingEnemies.map((enemy) => {
        const enemyIndex = enemies.indexOf(enemy);
        return Animated.timing(enemyMoveAnimations[enemyIndex], {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        });
      })
    ).start(() => {
      Animated.parallel(
        livingEnemies.map((enemy) => {
          const enemyIndex = enemies.indexOf(enemy);
          return Animated.timing(enemyMoveAnimations[enemyIndex], {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          });
        })
      ).start();
    });
  };

  const shakeEnemy = (index: number) => {
    Animated.sequence([
      Animated.timing(enemyShakeAnimations[index], {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(enemyShakeAnimations[index], {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(enemyShakeAnimations[index], {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const performAttackAnimation = (characterIndex: number) => {
    Animated.timing(characterMoveAnimations[characterIndex], {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      Animated.sequence([
        Animated.timing(swingAnimation, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(swingAnimation, {
          toValue: -1,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(swingAnimation, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.timing(characterMoveAnimations[characterIndex], {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    });
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    slideAnim.setValue(0);

    return () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    };
  }, []);

  useEffect(() => {
    if (currentTurn === 'player') {
      if (selectedCharacter === null) {
        setTurnMessage('Select a character to attack');
      } else if (selectedTarget === null) {
        setTurnMessage('Select a target enemy to attack');
      }
    } else {
      setTurnMessage('Enemies are attacking...');
    }

    const defeatedEnemy = enemies.find(enemy => enemy.hp <= 0);
    if (defeatedEnemy) {
      //setTurnMessage(`${defeatedEnemy.name} was defeated!`);
      setTimeout(() => {
        if (currentTurn === 'player') {
          setTurnMessage('Select a character to attack!');
        }
      }, 2000);
    }
  }, [currentTurn, selectedCharacter, selectedTarget, enemies]);

  useEffect(() => {
    setParty(team);

    const getRandomEnemies = (enemiesArray, enemyCount) => {
      const shuffled = [...enemiesArray].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, enemyCount);
    };

    const scaleEnemyStats = (enemy, level, isBossBattle) => {
      let hpScaleFactor = 1 + (level * 0.3);
      let atkDefScaleFactor = 1 + (level * 0.3);

      if(isBossBattle) {
        hpScaleFactor = hpScaleFactor + level;
      }

      return {
        ...enemy,
        hp: Math.round(enemy.hp * hpScaleFactor),
        hp: Math.round(enemy.maxHp * hpScaleFactor),
        attack: Math.round(enemy.attack * atkDefScaleFactor),
        defense: Math.round(enemy.defense * atkDefScaleFactor),
      };
    };

    let enemyCount = level > 5 ? 5 : level;
    let enemyScaleLevel = level;

    if(isBossBattle) {
      enemyCount = 1;
      enemyScaleLevel = level + 20;
    }

    const randomEnemies = getRandomEnemies(enemiesTierOne, enemyCount)
      .map(enemy => (
        {...scaleEnemyStats(enemy, enemyScaleLevel, isBossBattle),
          isBoss: isBossBattle
        }));

    setEnemies(randomEnemies);

    setEnemyShakeAnimations(randomEnemies.map(() => new Animated.Value(0)));
    setEnemyMoveAnimations(randomEnemies.map(() => new Animated.Value(0)));
    setCharacterMoveAnimations(team.map(() => new Animated.Value(0)));
    setCharacterShakeAnimations(team.map(() => new Animated.Value(0)));

    setCurrentTurn('player');
    setSelectedCharacter(null);
    setSelectedTarget(null);
    setBattleLog([]);
  }, [battleCount, level]);

  useEffect(() => {
    if (selectedCharacter !== null || selectedTarget !== null) {
      swingAnimation.setValue(0);
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
    outputRange: ['-3deg', '3deg'],
  });

  useEffect(() => {
    if (enemies != undefined && enemies.length > 0 && enemies.every(character => character.hp <= 0)) {
      setTimeout(handleVictory, 2000);
    }
  }, [enemies]);

  useEffect(() => {
    //console.log("Estado atualizado do party:", party);
    if (party != undefined && party.length > 0 && party.every(character => character.hp <= 0)) {
      handleDefeat();
    }

    const allCharactersAttacked = party
        .filter(member => member.hp > 0)
        .every(member => member.attacked);

    if (allCharactersAttacked && turnNumber > 1) {
        setTimeout(enemyTurn, 1000);
        setCurrentTurn('enemy');
    }
  }, [party]);

  const handleDefeat = () => {
    startSlideAnimation(() => {
      router.push('/');
    });
  };

  const handleAttack = () => {
      if (selectedCharacter === null || selectedTarget === null) return;
  
      performAttackAnimation(selectedCharacter);
      shakeEnemy(selectedTarget);

      setParty(prevParty =>
        prevParty.map((member, index) =>
          index === selectedCharacter ? { ...member, isAttacking: true, attacked: true } : member
        )
      );
  
      setEnemies(prevEnemies => {
          const updatedEnemies = [...prevEnemies];
          const attacker = party[selectedCharacter];
          const defender = updatedEnemies[selectedTarget];
          const damage = Math.max(1, attacker.attack - defender.defense);
  
          updatedEnemies[selectedTarget] = {
              ...defender,
              hp: Math.max(0, defender.hp - damage),
          };
  
          setBattleLog(prev => [...prev, `${attacker.name} deals ${damage} damage to ${defender.name}!`]);
          return updatedEnemies;
      });
  
      setSelectedCharacter(null);
      setSelectedTarget(null);
  
      if (attackTimeouts.current[selectedCharacter]) {
          clearTimeout(attackTimeouts.current[selectedCharacter]);
      }
  
      attackTimeouts.current[selectedCharacter] = setTimeout(() => {
          setParty(prevParty =>
              prevParty.map((member, index) =>
                  index === selectedCharacter ? { ...member, isAttacking: false } : member
              )
          );
  
          //checkEnemyTurn();
      }, 1000);

      setTurnNumber(turnNumber + 1);
  };
  
  /*const checkEnemyTurn = () => {
      setParty(prevParty => {
        const allCharactersAttacked = prevParty
        .filter(member => member.hp > 0)
        .every(member => member.attacked);

          if (allCharactersAttacked) {
              setTimeout(enemyTurn, 1000);
              setCurrentTurn('enemy');
              return prevParty.map(member => ({ ...member, attacked: false }));
          }
  
          return prevParty;
      });
  
      setEnemies(prevEnemies => {
          /*if (prevEnemies.every(enemy => enemy.hp <= 0)) {
              handleVictory();
          }
          return prevEnemies;
      });
      //setEnemies(prevEnemies);
  };*/

  const enemyTurn = () => {
    let livingEnemies = enemies.filter(enemy => enemy.hp > 0);
    let livingParty = party.filter(character => character.hp > 0);
  
    if (livingEnemies.length === 0 || livingParty.length === 0) return;
  
    let updatedParty = [...party];
  
    performEnemyAttackAnimation();
  
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
  
        shakeCharacter(defenderIndex);
  
        livingParty = updatedParty.filter(character => character.hp > 0);
      }
    }

    for (let partyMember of updatedParty) {
      partyMember.attacked = false;
      partyMember.isAttacking = false;
    }
  
    setParty(updatedParty);
    setCurrentTurn("player");

    /*if (updatedParty.every(character => character.hp <= 0)) {
      handleDefeat();
    }*/

    setTurnNumber(turnNumber + 1);
  };
  

  const handleVictory = () => {
      console.log('handle victory');
      console.log(JSON.stringify(team));
      console.log(JSON.stringify(enemies));
    startSlideAnimation(() => {

      for(let teamMember of team) {
        for(let partyMember of party) {
          if(teamMember.id == partyMember.id) {
            teamMember.hp = partyMember.hp;
          }
        }
      }

      team = team.filter(character => character.hp > 0);
      if(isBossBattle) {
        const getRandomUpgrades = () => {
          const shuffled = [...upgrades].sort(() => 0.5 - Math.random());
          return shuffled.slice(0, 3);
        };

        let selectedUpgrade = getRandomUpgrades()[0];

        for(let character of team) {
          if(selectedUpgrade.type == 'literal') {
            character[selectedUpgrade.attribute] = character[selectedUpgrade.attribute] + selectedUpgrade.value;
          } 
          
          if(selectedUpgrade.type == 'percentage') {
            character[selectedUpgrade.attribute] = character[selectedUpgrade.attribute] + (character[selectedUpgrade.attribute] * selectedUpgrade.value);
          }

          if(selectedUpgrade.coAttribute) {
            character[selectedUpgrade.coAttribute] = character[selectedUpgrade.attribute];
          }
    
          character.upgrades.push(selectedUpgrade);
        }
        

        router.push({
          pathname: 'screens/victory',
          params: { 
            team: encodeURIComponent(JSON.stringify(team)),
            level: level,
            isFirstBattle: "false",
            battleCount: battleCount,
            generalBattleCount: generalBattleCount
          },
        });
      } else if(generalBattleCount % 10 === 0) {
        for(let teamMember of team) {
          teamMember.hp = teamMember.maxHp;
        }
        router.push({
          pathname: 'screens/battle',
          params: {
            team: encodeURIComponent(JSON.stringify(team)),
            level: level,
            battleCount: battleCount + 1,
            generalBattleCount: generalBattleCount,
            isBossBattle: true
          },
        });
      } else if (generalBattleCount % 5 === 0 && team.length < 4) {
        for(let teamMember of team) {
          teamMember.hp = teamMember.maxHp;
        }
        router.push({
          pathname: 'screens/character-select',
          params: { 
            team: encodeURIComponent(JSON.stringify(team)),
            level: level,
            isFirstBattle: "false",
            battleCount: battleCount + 1,
            generalBattleCount: generalBattleCount + 1
          },
        });
      } else if (generalBattleCount % 3 === 0) {
        for(let teamMember of team) {
          teamMember.hp = teamMember.maxHp;
        }
        router.push({
          pathname: 'screens/upgrade-select',
          params: { 
            team: encodeURIComponent(JSON.stringify(team)),
            level: level + 1,
            isFirstBattle: "false",
            battleCount: battleCount + 1,
            generalBattleCount: generalBattleCount + 1
          },
        });
      } else {

        router.push({
          pathname: 'screens/battle',
          params: {
            team: encodeURIComponent(JSON.stringify(team)),
            level: level,
            battleCount: battleCount + 1,
            generalBattleCount: generalBattleCount + 1,
            bossBattle: false
          },
        });
      }
    });
  };

  const screenWidth = Dimensions.get("screen").width;
  const screenHeight = Dimensions.get("screen").height;

  return (
    <ImageBackground
      source={isBossBattle
      ? require('../assets/battle/fire-arena.png') // Imagem de boss
      : level <= 5
        ? require('../assets/battle/dungeon_battle_earth.png') // Nível 1-5
        : level <= 10
          ? require('../assets/battle/Dungeon_battle_8340060.png') // Nível 6-10
          : level <= 15
            ? require('../assets/battle/Dungeon_battle_light.png') // Nível 11-15
            : level <= 20
              ? require('../assets/battle/Dungeon_battle_81028.png') // Nível 16-20
              : level <= 25
                ? require('../assets/battle/Dungeon_battle_80020.png') // Nível 21-25
                : level <= 30
                  ? require('../assets/battle/Dungeon_battle_10700.png') // Nível 26-30
                  : level <= 35
                    ? require('../assets/battle/Dungeon_battle_10400.png') // Nível 31-35
                    : level <= 40
                      ? require('../assets/battle/Dungeon_battle_8340060.png') // Nível 36-40
                      : require('../assets/battle/fire-arena.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/misc/battle-dialog.png')}
          style={styles.information}
          resizeMode="cover" 
        >
          <Animated.View style={[styles.turnMessageContainer, { opacity: fadeAnim }]}>
            <Text style={styles.turnMessageText}>{turnMessage}</Text>
          </Animated.View>
        </ImageBackground>
        {isBossBattle ? (
          <Image
            contentFit="none"
            source={require('../assets/misc/boss-indicator.png')}
            style={[styles.bossIndicator]}
          />
        ) : (
          <Text style={styles.battleInfo}>
            Battle {battleCount} - Level {level}
          </Text>
        )}
        
        <View style={styles.battleField}>
          <View style={styles.enemyContainer}>
            {enemies.map((enemy, index) => (
              <Animated.View
              key={enemy.id}
              style={[
                {
                  transform: [
                    { 
                      translateX: enemy.hp > 0 ? enemyMoveAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 50],
                      }) : 0,
                    },
                    { translateX: enemyShakeAnimations[index] },
                    { rotate: selectedTarget === index ? swing : '0deg' },
                  ],
                },
              ]}
            >
              <Pressable
                style={[
                  styles.enemyCard,
                  enemy.hp <= 0 && styles.defeated,
                ]}
                onPress={() => currentTurn === 'player' && enemy.hp > 0 && setSelectedTarget(index)}
              >
                {
                  isBossBattle ? 
                  <Image contentFit="none" source={enemy.image} style={[styles.bossImage]} />
                  :
                  <Image contentFit="none" source={enemy.image} style={[styles.enemyImage]} />
                }
                
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
                    { 
                      transform: [
                        { 
                          translateX: characterMoveAnimations[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -100],
                          }),
                        },
                        { translateX: character.hp > 0 ? characterShakeAnimations[index] : 0 },
                        { rotate: selectedCharacter === index ? swing : '0deg' }
                      ]
                    },
                  ]}
                >
                  <View style={styles.upgradeContainer}>
                  {character.upgrades.map((upgrade, index) => (
                      <Image
                        key={character.id + index}
                        source={upgrade.image}
                        style={styles.upgradeIcon}
                      />
                    ))}
                  </View>
                {character.attacked || character.hp <= 0 ? (
                  <View style={[styles.characterCard]}>
                    <Image 
                        source={require('../assets/misc/already-attacked.png')}
                        style={styles.attackIcon}
                        contentFit="cover"
                    />
                    <Image 
                        source={character.isAttacking ? character.attackImage : character.image}
                        style={(character.isAttacking && character.image != character.attackImage) ? styles.characterImageAttacking : styles.characterImage}
                        contentFit="none"
                    />
                    <Text style={styles.characterName}>{character.name}</Text>
                    <HealthBar hp={character.hp} maxHp={character.maxHp} isEnemy={false} />
                  </View>
                ) : (
                  <Pressable
                    style={[
                      styles.characterCard,
                      currentTurn === 'player' && styles.activeTurn
                    ]}
                    onPress={() => { currentTurn === 'player' && setSelectedCharacter(index)}}
                  >
                    <Image 
                        source={require('../assets/misc/attack.png')}
                        style={styles.attackIcon}
                        contentFit="cover"
                    />
                    <Image 
                        source={character.isAttacking ? character.attackImage : character.image} 
                        style={(character.isAttacking && character.image != character.attackImage) ? styles.characterImageAttacking : styles.characterImage}
                        key={character.isAttacking ? "attacking" : "idle"} 
                        contentFit="none"
                    />
                    <Text style={styles.characterName}>{character.name}</Text>
                    <HealthBar hp={character.hp} maxHp={character.maxHp} isEnemy={false} />
                  </Pressable>
                )}
                <View style={styles.characterLevel}>
                  {Array.from({ length: (character.currentEvolution+1) }, (_, i) => (
                    <Image
                      key={i}
                      source={require('../assets/misc/star.png')}
                      style={styles.star}
                    />
                  ))}
                </View>
              </Animated.View>
            ))}
          </View>
        </View>

        {currentTurn === 'player' && selectedCharacter !== null && selectedTarget !== null && (
          <Pressable style={styles.attackButton} onPress={handleAttack}>
            <ImageBackground
                source={require('../assets/misc/attack-image.png')}
                style={styles.attackButton}
                resizeMode="contain"
              >
              <Text style={styles.attackButtonText}>Attack</Text>
            </ImageBackground>
          </Pressable>
        )}

        <Animated.View
          style={[
            styles.slideOverlay,
            {
              transform: [
                {
                  translateX: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [screenWidth, -screenWidth],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  battleInfo: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
    paddingTop: 40,
    fontWeight: 800
  },
  battleInfoBoss: {
    fontSize: 24,
    color: 'red',
    textAlign: 'center',
    marginBottom: 5,
    paddingTop: 10,
    fontWeight: 800,
    opacity: 0.5
  },
  battleField: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%'
  },
  partyContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  enemyContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
  },
  characterCard: {
    borderRadius: 8,
    width: 120,
    alignItems: 'center',
  },
  bossIndicator: {
    top: '0',
    left: '40%',
    right: 0,
    alignSelf: 'center',
    position: 'absolute',
    width: 100,
    height: 100,
    transform: [{ scale: 1.5 }]
  },
  upgradeContainer: {
    position: 'relative',
    bottom: '-20',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 40,
  },
  upgradeIcon: {
    width: 15,
    height: 15,
    bottom: 0,
  },
  characterLevel: {
    position: 'relative',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    width: 10,
    height: 10,
    bottom: 0,
  },
  attackIcon: {
    position: 'absolute',
    //left: '-10',
    right: 0,
    bottom: 0,
    width: 20,
    height: 20,
    zIndex: 40
  },
  characterImage: {
    marginBottom: '-10',
    width: 100,
    height: 100,
    transform: [{ scale: 2.5 }]
  },
  characterImageAttacking: {
    marginBottom: 10,
    width: 150,
    height: 150,
    transform: [{ scale: 2.5 }]
  },
  enemyCard: {
    borderRadius: 8,
    width: 120,
    alignItems: 'center',
  },
  bossImage: { 
    marginBottom: '-10',
    width: 100,
    height: 100,
    transform: [{ scale: 4 }, { scaleX: -1 }]
  },
  enemyImage: { 
    marginBottom: '-10',
    width: 100,
    height: 100,
    transform: [{ scale: 2 }, { scaleX: -1 }]
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
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  attackButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  information: {
    transform: [{ scale: 0.8 }],
    position: 'absolute',
    width: '100%',
    height: '40%',
    top: '0%',
    left: '5%'
  },
  turnMessageContainer: {
    top: 70,
    /*backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,*/
  },
  turnMessageText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  slideOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get("screen").width + 500,
    height: Dimensions.get("screen").height,
    backgroundColor: 'black',
    zIndex: 9999,
    overflow: 'hidden',
  }
});