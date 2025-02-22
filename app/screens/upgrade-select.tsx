import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { characters } from '../data/characters';
import { upgrades } from '../data/upgrades';

type Character = {
  id: number;
  name: string;
  type: string;
  hp: number;
  attack: number;
  defense: number;
  image: string;
};

export default function UpgradeSelectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const level = Number(params.level);
  const team = params.team ? JSON.parse(params.team): [];
  const isFirstBattle = params.isFirstBattle === 'true';
  const generalBattleCount = Number(params.generalBattleCount);

  const [selectedUpgrade, setSelectedUpgrade] = useState(null);
  const [availableUpgrades, setAvailableUpgrades] = useState([]);

  useEffect(() => {
    const getRandomUpgrades = () => {
      const shuffled = [...upgrades].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
    };

    const characterEvolutionUpgrade = () => {
      let teamCharacters = [...team].sort(() => 0.5 - Math.random());

      for(let char of teamCharacters) {
        if(!char.evolutions) {
          continue;
        }
        let charNextEvolution = char.evolutions[char.currentEvolution+1];

        if(charNextEvolution != undefined) {
          return {
            attribute: null,
            type: "evolution",
            evolution: charNextEvolution,
            currentEvolution: char
          }
        }
      }

      return null;
    }

    let shuffledUpgrades = getRandomUpgrades();
    let characterUpgrade = characterEvolutionUpgrade();

    console.log(characterUpgrade);
    if(characterUpgrade != null) {
      shuffledUpgrades[1] = characterUpgrade;
    }

    setAvailableUpgrades(shuffledUpgrades);
  }, [generalBattleCount, level]);

  const handleUpgradeSelect = (upgrade) => {
    setSelectedUpgrade(upgrade);
  };

  const handleConfirm = () => {
    let teamUpdated = [...team];
    for(let character of teamUpdated) {

      if(selectedUpgrade.type == 'evolution' && selectedUpgrade.currentEvolution.id == character.id) {
        character.image = selectedUpgrade.evolution.image;
        character.attackImage = selectedUpgrade.evolution.attackImage;
        character.name = selectedUpgrade.evolution.name;
        character.hp = character.hp + selectedUpgrade.evolution.hp;
        character.maxHp = character.maxHp + selectedUpgrade.evolution.maxHp;
        character.attack = character.attack + selectedUpgrade.evolution.attack;
        character.defense = character.defense + selectedUpgrade.evolution.defense;
        character.currentEvolution = character.currentEvolution + 1;
        break;
      }

      if(selectedUpgrade.type == 'literal') {
        character[selectedUpgrade.attribute] = character[selectedUpgrade.attribute] + selectedUpgrade.value;
      } 
      
      if(selectedUpgrade.type == 'percentage') {
        character[selectedUpgrade.attribute] = character[selectedUpgrade.attribute] + (character[selectedUpgrade.attribute] * selectedUpgrade.value);
      }

      if(selectedUpgrade.coAttribute) {
        character[selectedUpgrade.coAttribute] = character[selectedUpgrade.attribute];
      }
    }

    router.push({
      pathname: 'screens/battle',
      params: {
        team: JSON.stringify(teamUpdated),
        level: level,
        battleCount: isFirstBattle ? 1 : Math.floor((level - 1) / 5) * 5 + 1,
        generalBattleCount: isFirstBattle ? 1 : generalBattleCount
      }
    });
  };

  const formatValue = (upgrade) => {
    if (upgrade.type === "percentage") {
        return `${upgrade.value * 100}%`;
    }
    return upgrade.value;
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Upgrade</Text>
      
      <View style={styles.upgradesContainer}>
        {availableUpgrades.map((upgrade, index) => (
          <Pressable
            key={index}
            style={[
              styles.upgradeCard,
              selectedUpgrade === upgrade && styles.selectedUpgrade
            ]}
            onPress={() => handleUpgradeSelect(upgrade)}
          >

            {upgrade.type === "evolution" && (
              <View style={styles.evolutionBlock}>
                <Text style={styles.upgradeText}> Evolve {upgrade.currentEvolution.name} to  {upgrade.evolution.name}</Text>
                <Image source={upgrade.evolution.image} style={[styles.characterImage]} />
              </View>
            )}

            {upgrade.type !== "evolution" && (
              <View style={styles.blockStyle}>
                <Text style={styles.upgradeText}>{upgrade.attribute}</Text>
                <Text style={styles.upgradeText}>+ {formatValue(upgrade)}</Text>
              </View>
            )}
            
          </Pressable>
        ))}
      </View>

      {selectedUpgrade && (
        <Pressable style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm Upgrade</Text>
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
    textAlign: 'center'
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
  upgradesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '50%',
    gap: 20,
    marginBottom: 30,
  },
  upgradeCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 15,
    width: 100,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2a2a2a',
  },
  selectedUpgrade: {
    borderColor: '#4CAF50',
    transform: [{ scale: 1.05 }],
  },
  upgradeText: {
    color: '#ffffff',
    marginBottom: 5,
    textAlign: 'center',
    alignSelf: 'stretch',
    flexWrap: 'wrap',
    padding: 10
  },
  characterImage: {
    width: 120,
    height: 100,
    marginBottom: 10
  },
  blockStyle: {
    paddingTop: '60%'
  },
  evolutionBlock: {
    textAlign: 'center'
  }
});