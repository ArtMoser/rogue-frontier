import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function SelectionScreen() {
  const router = useRouter();
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);

  const handleSquareSelect = (index: number) => {
    setSelectedSquare(index);
  };

  const handleConfirm = () => {
    if (selectedSquare !== null) {
      router.push({
        pathname: '/result',
        params: { selectedSquare }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Square</Text>
      <View style={styles.squaresContainer}>
        {[0, 1, 2].map((index) => (
          <Pressable
            key={index}
            style={[
              styles.square,
              selectedSquare === index && styles.selectedSquare
            ]}
            onPress={() => handleSquareSelect(index)}
          />
        ))}
      </View>
      {selectedSquare !== null && (
        <Pressable style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm Selection</Text>
        </Pressable>
      )}
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 40,
  },
  squaresContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 40,
  },
  square: {
    width: 80,
    height: 80,
    backgroundColor: '#ff0000',
    borderRadius: 8,
  },
  selectedSquare: {
    borderWidth: 4,
    borderColor: '#ffffff',
    transform: [{ scale: 1.1 }],
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});