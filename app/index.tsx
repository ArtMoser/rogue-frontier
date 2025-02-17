import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function StartScreen() {
  const router = useRouter();

  const startGame = () => {
    router.push({
      pathname: 'screens/character-select',
      params: { level: 1, isFirstBattle: true }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dungeon Crawler</Text>
      <Text style={styles.subtitle}>A Roguelike RPG Adventure</Text>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1612404730960-5c71577fca11?q=80&w=400' }}
        style={styles.image}
      />
      <Pressable style={styles.startButton} onPress={startGame}>
        <Text style={styles.startButtonText}>Start Journey</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textShadowColor: '#4CAF50',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 20,
    color: '#4CAF50',
    marginBottom: 40,
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 15,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 60,
    paddingVertical: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});