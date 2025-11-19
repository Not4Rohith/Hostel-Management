import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import * as Location from "expo-location";

export default function LocationPage() {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setCoords(loc.coords);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Location</Text>

      {coords ? (
        <>
          <Text>Latitude: {coords.latitude}</Text>
          <Text>Longitude: {coords.longitude}</Text>
        </>
      ) : (
        <Text>Loading location…</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, marginBottom: 10 }
});