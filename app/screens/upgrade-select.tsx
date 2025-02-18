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

    setAvailableUpgrades(getRandomUpgrades());
  }, []);

  const handleUpgradeSelect = (upgrade) => {
    setSelectedUpgrade(upgrade);
  };

  const handleConfirm = () => {
    let teamUpdated = [...team];
    console.log('### teamUpdated before => ' + JSON.stringify(teamUpdated));
    for(let character of teamUpdated) {
      let updatedAttributeValue;
      if(selectedUpgrade.type == 'literal') {
        character[selectedUpgrade.attribute] += selectedUpgrade.value;
        updatedAttributeValue = selectedUpgrade.value;
      } else if(selectedUpgrade.type == 'percentage') {
        character[selectedUpgrade.attribute] = character[selectedUpgrade.attribute] + (character[selectedUpgrade.attribute] * selectedUpgrade.value);
        updatedAttributeValue = character[selectedUpgrade.attribute];
      }

      if(selectedUpgrade.coAttribute) {
        character[coAttribute] = updatedAttributeValue;
      }
    }

    console.log('### teamUpdated after => ' + JSON.stringify(teamUpdated));

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
            <Text style={styles.upgradeText}>{upgrade.attribute}</Text>
            <Text style={styles.upgradeText}>{upgrade.type}</Text>
            <Text style={styles.upgradeText}>{upgrade.value}</Text>
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
    fontSize: 16,
    marginBottom: 5,
  },
});