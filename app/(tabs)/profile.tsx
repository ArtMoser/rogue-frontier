import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const navigateToHome = () => {
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Perfil</Text>
      <View style={styles.profileContainer}>
        <Text style={styles.label}>ID do Usuário:</Text>
        <Text style={styles.info}>{params.userId}</Text>
        <Text style={styles.label}>Nome de Usuário:</Text>
        <Text style={styles.info}>{params.username}</Text>
        {params.source && (
          <>
            <Text style={styles.label}>Origem:</Text>
            <Text style={styles.info}>{params.source}</Text>
          </>
        )}
      </View>
      <Pressable style={styles.button} onPress={navigateToHome}>
        <Text style={styles.buttonText}>Voltar para Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  profileContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '90%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: '#666',
  },
  info: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});