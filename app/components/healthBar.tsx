import { View, Text, StyleSheet } from "react-native";

const HealthBar = ({ hp, maxHp, isEnemy }) => {
  const hpPercentage = (hp / maxHp) * 100;
  const roundedHp = Math.floor(hp);
  const roundedMaxHp = Math.floor(maxHp);

  return (
    <View style={isEnemy ? styles.containerEnemy : styles.container}>
      <View style={styles.healthBarBackground}>
        <View
          style={[
            styles.healthBarFill,
            {
              width: `${hpPercentage}%`,
              backgroundColor: isEnemy
                ? "red"
                : hpPercentage > 50
                ? "green"
                : hpPercentage > 20
                ? "orange"
                : "red",
            },
          ]}
        />
      </View>
      <Text style={styles.healthText}>
        {roundedHp}/{roundedMaxHp}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containerEnemy: {
    width: 80,
    height: 25, // Aumentei a altura para acomodar o texto
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    bottom: -5
  },
  container: {
    width: 80,
    height: 25, // Aumentei a altura para acomodar o texto
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    bottom: -20
  },
  healthBarBackground: {
    width: "100%",
    height: 7,
    backgroundColor: "#444",
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 0.7,
    borderColor: "#fff",
    position: "absolute", // Posiciona a barra atrás do texto
  },
  healthBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  healthText: {
    color: "#fff", // Cor do texto
    fontSize: 9, // Tamanho do texto
    fontWeight: "bold", // Peso da fonte
  },
});

export default HealthBar;