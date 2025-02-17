import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const selectedSquare = Number(params.selectedSquare);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Result</Text>
      <Text style={styles.resultText}>
        You selected square #{selectedSquare + 1}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
  },
});