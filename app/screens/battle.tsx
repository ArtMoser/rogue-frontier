import { View, Text, StyleSheet, Pressable, Animated, ImageBackground, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

import { upgrades } from '../data/upgrades';
import { enemiesTierOne } from '../data/enemies';
import HealthBar from "../components/healthBar";
import BattleInfo from '../components/battleInfo';

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
  const [characterHistory, setCharacterHistory] = useState<Character[]>([]);
  const [turnDamage, setTurnDamage] = useState<number | null>(0);

  const [swingAnimation] = useState(new Animated.Value(0));
  const [characterMoveAnimations, setCharacterMoveAnimations] = useState<Animated.Value[]>([]);
  const [enemyShakeAnimations, setEnemyShakeAnimations] = useState<Animated.Value[]>([]);
  const [enemyMoveAnimations, setEnemyMoveAnimations] = useState<Animated.Value[]>([]);
  const [characterShakeAnimations, setCharacterShakeAnimations] = useState<Animated.Value[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const attackTimeouts = useRef<Record<number, NodeJS.Timeout>>({});

  const [sound, setSound] = useState();
  const [effectSound, setEffectSound] = useState(null);

  const slideAnim = useRef(new Animated.Value(0)).current;

  const soundRef = useRef(null);
  const isPlayingRef = useRef(false);

  async function playSoundForLevel() {
    if (isPlayingRef.current) return; // Impede tocar outro som se já estiver tocando

    isPlayingRef.current = true; // Marca que um som está sendo iniciado

    // Para e descarrega o som anterior (se houver)
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (error) {
        console.log('Erro ao parar/descarregar o som:', error);
      }
      soundRef.current = null;
    }

    let soundFile;
    if (level <= 5) {
      soundFile = require('../assets/sounds/ToD2_B1.mp3');
    } else if (level <= 10) {
      soundFile = require('../assets/sounds/ToV_B2.mp3');
    } else if (level <= 15) {
      soundFile = require('../assets/sounds/ToV_B1.mp3');
    } else if (level <= 20) {
      soundFile = require('../assets/sounds/ToX_B1.mp3');
    } else if (level <= 25) {
      soundFile = require('../assets/sounds/ToD_B1.mp3');
    } else if (level <= 30) {
      soundFile = require('../assets/sounds/TerraBattle_dungeon.mp3');
    } else if (level <= 35) {
      soundFile = require('../assets/sounds/bf48_raid_batlle.mp3');
    } else if (level <= 40) {
      soundFile = require('../assets/sounds/bf051_boss02_vari.mp3');
    } else {
      soundFile = require('../assets/sounds/TerraBattle_dungeon.mp3');
    }

    if (isBossBattle) {
      soundFile = require('../assets/sounds/bf006_btl_boss.mp3');
    }

    try {
      const { sound } = await Audio.Sound.createAsync(soundFile, { isLooping: true });
      soundRef.current = sound;

      await sound.setVolumeAsync(0.05);
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) {
          isPlayingRef.current = false; // Libera para um novo áudio se necessário
        }
      });
    } catch (error) {
      console.error('Erro ao carregar e tocar o som:', error);
      isPlayingRef.current = false; // Libera caso dê erro
    }
  }

  useEffect(() => {
    playSoundForLevel();

    return () => {
      // Para e descarrega quando o componente for desmontado
      if (soundRef.current) {
        soundRef.current.stopAsync();
        soundRef.current.unloadAsync();
      }
      isPlayingRef.current = false; // Libera para um novo áudio quando desmontado
    };
  }, [level, isBossBattle]);

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
      duration: 500,
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
          duration: 300,
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
    if (enemies != undefined && enemies.length > 0 && enemies.every(character => character.hp <= 0)) {
      return;
    }

    if(currentTurn === 'enemy') {
      setTimeout(() => {
        let enemiesDamage = [...enemies];
        for(let enemie of enemiesDamage) {
          enemie.damageTaken = 0;
        }

        setEnemies(enemiesDamage);
      }, 1000);
    }
  }, [currentTurn]);

  useEffect(() => {
    setTurnDamage(0);
  }, [generalBattleCount]);

  useEffect(() => {
    setParty(team);

    const getRandomEnemies = (enemiesArray, enemyCount) => {
      const shuffled = [...enemiesArray].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, enemyCount);
    };

    const scaleEnemyStats = (enemy, level, isBossBattle) => {
      let multiplier = 1 + (level / 10);
    
      let hpScaleFactor = multiplier + (level * 0.20);
      let atkDefScaleFactor = multiplier + (level * 0.1);
    
      if (isBossBattle) {
        hpScaleFactor *= 1.5;
        hpScaleFactor += Math.pow(level, 0.5);
      }
    
      return {
        ...enemy,
        hp: Math.min(Math.round(enemy.hp * hpScaleFactor), 30000),
        maxHp: Math.min(Math.round(enemy.maxHp * hpScaleFactor), 30000),
        attack: Math.round(enemy.attack * atkDefScaleFactor),
        defense: Math.round(enemy.defense * atkDefScaleFactor),
      };
    };

    let enemyCount = level > 5 ? 5 : level;
    let enemyScaleLevel = level;


    if(isBossBattle) {
      enemyCount = 1;
      enemyScaleLevel = level + 10;

      if(level > 10 && level < 15) { 
        enemyCount = 2;
        enemyScaleLevel = level + 15;
      } else if(level > 16) {
        enemyCount = 3;
        enemyScaleLevel = level + 20;
      }
    }

    let enemiesFiltered = [];

    if(level <= 9) {
      enemiesFiltered = enemiesTierOne.filter(enemy => enemy.difficulty == "Easy");
    } else if(level <= 20) {
      enemiesFiltered = enemiesTierOne.filter(enemy => enemy.difficulty == "Normal" || enemy.difficulty == "Easy");
    } else {
      enemiesFiltered = enemiesTierOne;
    }

    const randomEnemies = getRandomEnemies(enemiesFiltered, enemyCount)
      .map(enemy => (
        {...scaleEnemyStats(enemy, enemyScaleLevel, isBossBattle),
          isBoss: isBossBattle,
          damageTaken: 0
        }));

    for(let enemy of randomEnemies) {
      let totalAttributes = Math.floor(((enemy.hp + enemy.attack + enemy.defense) * 20) / 550);
      enemy.rarity = Math.floor(totalAttributes / 5);
    }

    setEnemies(randomEnemies);

    setEnemyShakeAnimations(randomEnemies.map(() => new Animated.Value(0)));
    setEnemyMoveAnimations(randomEnemies.map(() => new Animated.Value(0)));
    setCharacterMoveAnimations(team.map(() => new Animated.Value(0)));
    setCharacterShakeAnimations(team.map(() => new Animated.Value(0)));

    setCurrentTurn('player');
    setSelectedCharacter(null);
    setSelectedTarget(null);
    setBattleLog([]);
    playSoundForLevel();
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

    if (allCharactersAttacked && turnNumber > 1 && currentTurn === 'player') {
        setTimeout(enemyTurn, 1000);
        setCurrentTurn('enemy');
    }
  }, [party]);

  async function stopSounds() {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (error) {
        console.log('Erro ao parar/descarregar o som:', error);
      }
      soundRef.current = null;
    }
  }

  const handleDefeat = () => {
    stopSounds();
    startSlideAnimation(() => {
      router.push({
        pathname: 'screens/end-game',
        params: { 
          characterHistory: encodeURIComponent(JSON.stringify(characterHistory)),
          level: level,
          generalBattleCount: generalBattleCount,
          isWin: false
        },
      });
      //router.push('/');
    });
  };

  const playSoundEffect = async (character) => {
    if (effectSound) {
      await effectSound.stopAsync();
      await effectSound.unloadAsync();
    }
    let soundFile;
    
    if(character.sound == 'fire') {
      soundFile = require('../assets/sounds/damage/bf201_se_slash1.mp3');
      if(character.currentEvolution >= 0) {
        soundFile = require('../assets/sounds/damage/bf207_se_fire2.mp3');
      }
    } else if(character.sound == 'water') {
      soundFile = require('../assets/sounds/damage/bf201_se_slash1.mp3');
      if(character.currentEvolution >= 0) {
        soundFile = require('../assets/sounds/damage/bf210_se_water2.mp3');
      }
      /*if(character.currentEvolution >= 1) {
        soundFile = require('../assets/sounds/damage/bf211_se_water3.mp3');
      }*/
    } else if(character.sound == 'dark') {
      soundFile = require('../assets/sounds/damage/bf201_se_slash1.mp3');
      if(character.currentEvolution >= 0) {
        soundFile = require('../assets/sounds/damage/bf222_se_dark2.mp3');
      }
      if(character.currentEvolution >= 1) {
        soundFile = require('../assets/sounds/damage/bf223_se_dark3.mp3');
      }
    } else if(character.sound == 'thunder') {
      soundFile = require('../assets/sounds/damage/bf201_se_slash1.mp3');
      if(character.currentEvolution >= 0) {
        soundFile = require('../assets/sounds/damage/bf216_se_thunder2.mp3');
      }
      if(character.currentEvolution >= 1) {
        soundFile = require('../assets/sounds/damage/bf217_se_thunder3.mp3');
      }
    } else if(character.sound == 'shot') {
      soundFile = require('../assets/sounds/damage/bf201_se_slash1.mp3');
      if(character.currentEvolution >= 0) {
        soundFile = require('../assets/sounds/damage/bf204_se_shot2.mp3');
      }
    } else {
      soundFile = require('../assets/sounds/damage/bf201_se_slash1.mp3');
    }

    const { sound: newSound } = await Audio.Sound.createAsync(soundFile);
    setEffectSound(newSound);
    await newSound.setVolumeAsync(0.1);
    await newSound.playAsync();
  }

  const handleAttack = () => {
      if (selectedCharacter === null || selectedTarget === null) return;
      playSoundEffect(party[selectedCharacter]);
  
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
        let totalDamage = 0;
    
        if (attacker.attackType === 'multiTarget') {
            // Dano dividido entre todos os inimigos
            //const splitDamage = Math.floor(damage / updatedEnemies.length);
            let livingEnemies = enemies.filter(enemy => enemy.hp > 0);

            let splitDamage = damage;

            if(livingEnemies.length > 0) {
              splitDamage = damage / livingEnemies.length;
            }
            
            //let remainingDamage = damage;
    
            let index = 0; // Variável para manter o índice

            for (const enemy of updatedEnemies) {
              if (enemy.hp > 0) {
                updatedEnemies[index] = {
                  ...enemy,
                  hp: Math.max(0, enemy.hp - splitDamage),
                  damageTaken: enemy.damageTaken + splitDamage
                };

                totalDamage = totalDamage + splitDamage;
              }
              index++; 
            }
    
            setBattleLog(prev => [...prev, `${attacker.name} deals ${splitDamage} damage to all enemies!`]);
        } else {
            // Dano completo no inimigo selecionado
            updatedEnemies[selectedTarget] = {
                ...defender,
                hp: Math.max(0, defender.hp - damage),
                damageTaken: updatedEnemies[selectedTarget].damageTaken + damage
            };

            totalDamage = damage;
    
            setBattleLog(prev => [...prev, `${attacker.name} deals ${damage} damage to ${defender.name}!`]);
        }
        
        let auxTurnDamage = turnDamage;
        setTurnDamage(auxTurnDamage + totalDamage);
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
      }, 2000);

      setTurnNumber(turnNumber + 1);
  };

  const enemyTurn = () => {
    let livingEnemies = enemies.filter(enemy => enemy.hp > 0);
    let livingParty = party.filter(character => character.hp > 0);
  
    if (livingEnemies.length === 0 || livingParty.length === 0) return;
    
    playSoundEffect({ sound: 'fire', currentEvolution: -1 });

    let updatedParty = [...party];
  
    performEnemyAttackAnimation();
  
    for (let enemy of livingEnemies) {
      if (livingParty.length === 0) break;
  
      let defender = livingParty[Math.floor(Math.random() * livingParty.length)];
      let damage = Math.max(1, enemy.attack - defender.defense);
  
      let defenderIndex = updatedParty.findIndex(char => char.id === defender.id);

      if(damage <= 1) {
        damage = (updatedParty[defenderIndex].hp * 0.05);
      }

      if (defenderIndex !== -1) {
        updatedParty[defenderIndex] = {
          ...updatedParty[defenderIndex],
          hp: Math.max(0, updatedParty[defenderIndex].hp - damage),
        };
  
        setBattleLog(prev => [...prev, `${enemy.name} deals ${damage} damage to ${defender.name}!`]);

        shakeCharacter(defenderIndex);

        if(updatedParty[defenderIndex].hp <= 0) {
          let defeatPartyMember = {... updatedParty[defenderIndex]};
          defeatPartyMember.isDefeated = true;
          setCharacterHistory(prev => [...prev, defeatPartyMember]);
        }

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

  const getDamageStyle = (damage) => {
    if (damage > 20000) {
      return { color: '#FFD700', fontSize: 36, textShadowColor: '#FFA500', textShadowRadius: 5 };
    } else if (damage > 10000) {
      return { color: '#00FFFF', fontSize: 32, textShadowColor: '#00CED1', textShadowRadius: 5 };
    } else if (damage > 5000) {
      return { color: '#FF1493', fontSize: 28, textShadowColor: '#FF69B4', textShadowRadius: 5 };
    } else if (damage > 2000) {
      return { color: '#8A2BE2', fontSize: 24, textShadowColor: '#9400D3', textShadowRadius: 5 };
    } else if (damage > 1000) {
      return { color: '#FF4500', fontSize: 20, textShadowColor: '#DC143C', textShadowRadius: 5 };
    } else if (damage > 500) {
      return { color: '#FFD700', fontSize: 18, textShadowColor: '#DAA520', textShadowRadius: 5 };
    } else {
      return { color: '#FFFFFF', fontSize: 16, textShadowColor: 'transparent', textShadowRadius: 0 };
    }
  };

  const handleVictory = () => {
    console.log('###### generalBattleCount:', generalBattleCount);
    setSound(null);
    startSlideAnimation(() => {

      for(let teamMember of team) {
        for(let partyMember of party) {
          if(teamMember.id == partyMember.id) {
            teamMember.hp = partyMember.hp;
          }
        }
      }

      team = team.filter(character => character.hp > 0);

      if(generalBattleCount == 94) {
        console.log('###### final stage');
        stopSounds();
        let updatedHistory = team.map(member => ({
          ...member,
          isDefeated: false
        }));

        let charactersUsed = [...characterHistory];

        for(let teamMember of updatedHistory) {
          if(teamMember.hp > 0) {
            charactersUsed.push(teamMember);
          }
        }
        stopSounds();
        router.push({
          pathname: 'screens/end-game',
          params: { 
            characterHistory: encodeURIComponent(JSON.stringify(charactersUsed)),
            level: level,
            generalBattleCount: generalBattleCount,
            isWin: true
          },
        });

      } else if(isBossBattle) {
        console.log('###### Boss battle victory');
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
      } else if((generalBattleCount + 1) % 10 === 1) {
        console.log('###### Boss battle');
        for(let teamMember of team) {
          teamMember.hp = teamMember.hp + (teamMember.maxHp * 0.2);
        }
        router.push({
          pathname: 'screens/battle',
          params: {
            team: encodeURIComponent(JSON.stringify(team)),
            level: level + 1,
            battleCount: battleCount + 1,
            generalBattleCount: generalBattleCount + 1,
            isBossBattle: true
          },
        });
      } else if (generalBattleCount % 5 === 0 && team.length < 5) {
        console.log('###### Character Select');
        router.push({
          pathname: 'screens/character-select',
          params: { 
            team: encodeURIComponent(JSON.stringify(team)),
            level: level,
            isFirstBattle: "false",
            battleCount: battleCount + 1,
            generalBattleCount: generalBattleCount
          },
        });
      } else if (generalBattleCount % 3 === 0) {
        console.log('###### Upgrade select');
        router.push({
          pathname: 'screens/upgrade-select',
          params: { 
            team: encodeURIComponent(JSON.stringify(team)),
            level: level + 1,
            isFirstBattle: "false",
            battleCount: battleCount + 1,
            generalBattleCount: generalBattleCount
          },
        });
      } else {
        console.log('###### Regular battle');
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

  // Posições dos inimigos e personagens
  const enemyPositions = [
    { top: -385, left: 0 },  // Inimigo 1
    { top: -305, left: 100 }, // Inimigo 2
    { top: -235, left: 0 }, // Inimigo 3
    { top: -164, left: 100 }, // Inimigo 4
    { top: -85, left: 0 }, // Inimigo 5
  ];

  const characterPositions = [
    { top: -400, right: -25 },  // Personagem 1
    { top: -320, right: 55 }, // Personagem 2
    { top: -250, right: -25 }, // Personagem 3
    { top: -180, right: 55 }, // Personagem 4
    { top: -100, right: -25 }, // Personagem 5
  ];

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
      resizeMode="stretch"
    >
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/misc/battle-dialog.png')}
          style={styles.information}
          resizeMode="cover" 
        >
          <Animated.View style={[styles.turnMessageContainer, { opacity: fadeAnim }]}>

            <Text style={styles.turnMessageText}>Battle Number: {Math.floor(generalBattleCount)}</Text>
          </Animated.View>
        </ImageBackground>
        {isBossBattle ? (
          <View>
            <Image
              contentFit="none"
              source={require('../assets/misc/boss-indicator.png')}
              style={[styles.bossIndicator]}
            />
            
            {/*<Text>Battle Damage:</Text> <Text>{turnDamage}</Text>*/}
            <Text style={styles.battleInfo}>
              <BattleInfo style={styles.positionInfo} turnDamage={turnDamage} />
            </Text>
            
          </View>
        ) : (
          <Text style={styles.battleInfo}>
            {/*<Text>Battle Damage:</Text> <Text>{turnDamage}</Text>*/}
            <BattleInfo turnDamage={turnDamage} />
          </Text>
        )}
        
        <View style={styles.battleField}>
          <View style={styles.enemyContainer}>
            {enemies.map((enemy, index) => (
              <Animated.View
              pointerEvents="box-none"
                key={enemy.id + '' + index}
                style={[
                  styles.enemyWrapper,
                  {
                    position: 'absolute',
                    top: enemyPositions[index].top,
                    left: enemyPositions[index].left,
                  },
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
                    <Image contentFit="scale-down" source={enemy.image} style={[styles.bossImage]} />
                    :
                    <Image contentFit="scale-down" source={enemy.image} style={[styles.enemyImage]} />
                  }
                  {/*<Text style={styles.enemyName}>{enemy.name}</Text>*/}
                  <HealthBar hp={enemy.hp} maxHp={enemy.maxHp} isEnemy={true} />
                  {
                    enemy.damageTaken > 0 ?
                      <Text style={[styles.damageTaken, getDamageStyle(enemy.damageTaken)]}>{Math.floor(enemy.damageTaken)}</Text>
                    :
                    <Text></Text>
                  }
                  
                </Pressable>
                <View style={isBossBattle ? styles.enemyLevelboss : styles.enemyLevel}>
                {Array.from({ length: Math.min(enemy.rarity, 10) }, (_, i) => {
                let imageSource;

                switch (enemy.difficulty) {
                  case 'Easy':
                    imageSource = require('../assets/misc/star_red_enemy.png');
                    break;
                  case 'Normal':
                    imageSource = require('../assets/misc/star_enemy_purple.png');
                    break;
                  case 'Hard':
                    imageSource = require('../assets/misc/star_enemy.png');
                    break;
                  default:
                    imageSource = require('../assets/misc/star_red_enemy.png');
                    break;
                }

                return (
                  <Image
                    key={i}
                    source={imageSource}
                    style={styles.starEnemy}
                  />
                );
              })}
                </View>
              </Animated.View>
            ))}
          </View>

          <View style={styles.partyContainer}>
            {party.map((character, index) => (
              <Animated.View
                key={character.id + '' + index}
                style={[
                  character.isAttacking ? styles.characterWrapperAttacking : styles.characterWrapper,
                  {
                    position: 'absolute',
                    top: characterPositions[index].top,
                    right: characterPositions[index].right,
                  },
                  { 
                    transform: [
                      { 
                        translateX: characterMoveAnimations[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -150],
                        }),
                      },
                      { translateX: character.hp > 0 ? characterShakeAnimations[index] : 0 },
                      { rotate: selectedCharacter === index ? swing : '0deg' }
                    ]
                  },
                ]}
              >
                {!character.isAttacking ? (
                  <View style={styles.upgradeContainer}>
                    {/*character.upgrades.length < 5 ? (
                      // Exibe os upgrades individualmente se forem menos de 5
                      character.upgrades.map((upgrade, index) => (
                        <Image
                          key={character.id + index}
                          source={upgrade.image}
                          style={styles.upgradeIcon}
                        />
                      ))
                    ) : (*/
                      // Agrupa os upgrades por atributo e exibe a imagem e a quantidade
                      Object.entries(
                        character.upgrades.reduce((grouped, upgrade) => {
                          // Agrupa os upgrades pelo campo 'attribute'
                          if (!grouped[upgrade.attribute]) {
                            grouped[upgrade.attribute] = [];
                          }
                          grouped[upgrade.attribute].push(upgrade);
                          return grouped;
                        }, {})
                      ).map(([attribute, upgrades]) => (
                        <View key={attribute} style={styles.upgradeGroup}>
                          <Image
                            source={upgrades[0].image} // Usa a imagem do primeiro upgrade do grupo
                            style={styles.upgradeIcon}
                          />
                          <Text style={styles.upgradeCount}>{upgrades.length}</Text>
                        </View>
                      ))
                    //)
                    }
                  </View>
                ) : (
                  <></>
                )}
                {character.attacked || character.hp <= 0 ? (
                  <View style={[styles.characterCard],{ zIndex: 9998 }}>
                    {!character.isAttacking ?
                      <Image 
                        source={require('../assets/misc/already-attacked.png')}
                        style={styles.attackIcon}
                        contentFit="cover"
                        pointerEvents="none"
                      />
                    :
                      <></>
                    }
                    <Image 
                      source={character.isAttacking ? character.attackImage : character.image}
                      style={(character.isAttacking && character.image != character.attackImage) ? styles.characterImageAttacking : styles.characterImage}
                      contentFit="none"
                      pointerEvents="none"
                    />
                    {!character.isAttacking ?
                    <>
                      {/*<Text style={styles.characterName}>{character.name}</Text>*/}
                      <HealthBar hp={character.hp} maxHp={character.maxHp} isEnemy={false} />
                    </>
                    :
                    <></>
                    }
                    
                  </View>
                ) : (
                  <Pressable
                    style={[
                      styles.characterCard,
                      currentTurn === 'player' && styles.activeTurn,
                      { zIndex: 9998 }
                    ]}
                    onPress={() => { currentTurn === 'player' && setSelectedCharacter(index)}}
                  >
                    <View>
                      <Image 
                        source={require('../assets/misc/attack.png')}
                        style={styles.attackIcon}
                        contentFit="cover"
                        pointerEvents="none"
                      />
                      <Image 
                        source={character.isAttacking ? character.attackImage : character.image} 
                        style={(character.isAttacking && character.image != character.attackImage) ? styles.characterImageAttacking : styles.characterImage}
                        key={character.isAttacking ? "attacking" : "idle"} 
                        contentFit="none"
                        pointerEvents="none"
                      />
                      {/*<Text 
                        style={styles.characterName}
                        pointerEvents="none">
                          {character.name}
                      </Text>*/}
                      <HealthBar hp={character.hp} maxHp={character.maxHp} isEnemy={false} pointerEvents="none" />
                    </View>
                    <View style={styles.characterLevel}>
                      {Array.from({ length: (character.currentEvolution+1) }, (_, i) => (
                        <Image
                          key={i}
                          source={require('../assets/misc/star.png')}
                          style={styles.star}
                        />
                      ))}
                    </View>
                  </Pressable>
                  
                )}
                
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
    
    height: 150,
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
    alignItems: 'flex-end',
    paddingVertical: 20,
    marginBottom: '15%',
    width: '100%'
  },
  partyContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    gap: 0,
  },
  enemyContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 0,
  },
  characterCard: {
    /*borderColor: '#2a3a2a',
    borderWidth: 10,
    borderRadius: 8,*/
    width: 120,
    height: 120,
    alignItems: 'center',
  },
  positionInfo: {
    position: 'absolute',
    marginTop: 300,
  },
  bossIndicator: {
    top: 70,
    left: '35%',
    alignSelf: 'center',
    position: 'absolute',
    width: 100,
    height: 100,
    transform: [{ scale: 1.5 }]
  },
  upgradeContainer: {
    top: '-20',
    display: 'flex',
    position: 'absolute',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    maxWidth: 100,
    zIndex: 9999
  },
  upgradeGroup: {
    alignItems: 'center', // Centraliza a imagem e o número
  },
  upgradeIcon: {
    width: 30,
    height: 30,
  },
  upgradeCount: {
    fontSize: 16,
    position: 'absolute',
    color: 'white',
    top: -8,
    right: -3,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowRadius: 5
    
  },
  upgradesNumber: {
    position: 'absolute',
    top: 20,
    fontWeight: 'bold',
  },
  upgradeIcon: {
    width: 15,
    height: 15,
    bottom: 0,
    margin: 1
  },
  characterLevel: {
    position: 'relative',
    left: -5,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enemyLevelboss: {
    position: 'absolute',
    left: 0,
    top:  '150%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  enemyLevel: {
    position: 'absolute',
    left: 0,
    top: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  star: {
    width: 10,
    height: 10,
    bottom: -13,
  },
  starEnemy: {
    width: 10,
    height: 10,
    bottom: 0,
  },
  attackIcon: {
    position: 'absolute',
    right: 0,
    bottom: 5,
    width: 20,
    height: 20,
    zIndex: 40
  },
  statsSpacing: {
    top: 0, 
  },
  characterImage: {
    marginBottom: 0,
    width: 90,
    height: 80,
    transform: [{ scale: 2.5 }]
  },
  characterImageAttacking: {
    marginBottom: 0,
    width: 200,
    height: 200,
    transform: [{ scale: 2.5 }],
    zIndex: 9999
  },
  enemyCard: {
    borderRadius: 8,
    width: 50,
    height: 75,
    alignItems: 'center',
  },
  bossImage: { 
    marginBottom: '-10',
    width: 100,
    height: 100,
    transform: [{ scale: 2 }, { scaleX: -1 }]
  },
  enemyImage: { 
    marginBottom: 0,
    width: 50,
    height: 50,
    transform: [{ scale: 2 }, { scaleX: -1 }]
  },
  damageTaken: {
    position: 'absolute',
    top: 0,
    right: -20,
    fontWeight: 'bold',
    zIndex: 9999
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
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 5,
    position: 'absolute',
  },
  characterHp: {
    color: '#000',
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
    top: 70
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
  },
  characterWrapperAttacking: {
    zIndex: 9999
  }
});