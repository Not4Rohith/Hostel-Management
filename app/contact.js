import { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import * as Contacts from "expo-contacts";

export default function ContactsPage() {
  const [contactList, setContactList] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers]
        });
        setContactList(data);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      <FlatList
        data={contactList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.name}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 10 },
  item: { fontSize: 18, borderBottomWidth: 1, paddingVertical: 5 }
});