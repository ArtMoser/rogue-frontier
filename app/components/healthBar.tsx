import { View, Text } from "react-native";

const HealthBar = ({ hp, maxHp, isEnemy }) => {
  const hpPercentage = (hp / maxHp) * 100;
  return (
    <View style={{ width: 80, height: 3, backgroundColor: "#444", borderRadius: 5, overflow: "hidden" }}>
        <View
          style={{
            width: `${hpPercentage}%`,
            height: "100%",
            backgroundColor: isEnemy ? "red" : (hpPercentage > 50 ? "green" : hpPercentage > 20 ? "orange" : "red"),
          }}
        />
      </View>
  );
};

export default HealthBar;