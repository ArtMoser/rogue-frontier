import { View, Text } from "react-native";

const HealthBar = ({ hp, maxHp, isEnemy }) => {
  const hpPercentage = (hp / maxHp) * 100;
  return (
    <View style={{ width: 80, height: 5, backgroundColor: "#444", borderRadius: 5, overflow: "hidden" }}>
        <View
          style={{
            width: `${hpPercentage}%`,
            height: "100%",
            backgroundColor: isEnemy ? "red" : (hpPercentage > 50 ? "green" : hpPercentage > 20 ? "orange" : "red"),
            borderWidth: 0.7,
            borderColor: "#fff",
            borderRadius: 5
          }}
        />
      </View>
  );
};

export default HealthBar;