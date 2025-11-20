import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import * as Battery from "expo-battery";

export default function BatteryPage() {
  const [level, setLevel] = useState(null);

  useEffect(() => {
    Battery.getBatteryLevelAsync().then(val => setLevel(val * 100));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Battery Level: {level}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24 }
});