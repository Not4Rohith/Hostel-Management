import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, TextInput, IconButton, useTheme } from 'react-native-paper';
import { ChatMessage } from '../../types'; // Import the type

// Move mock data here or keep in api.ts
const MOCK_CHAT: ChatMessage[] = [
  { id: '1', user: 'Rohith', message: 'Has the water supply issue been resolved?', time: '10:30 AM', self: true },
  { id: '2', user: 'Warden', message: 'Yes, the plumber just left.', time: '10:35 AM', self: false },
];

export default function ChatSection() {
  const theme = useTheme();
  const [msgText, setMsgText] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(MOCK_CHAT);

  const sendMessage = () => {
    if (!msgText.trim()) return;
    
    const newMsg: ChatMessage = { 
      id: Date.now().toString(), 
      user: 'Me', 
      message: msgText, 
      time: 'Just now', 
      self: true 
    };
    
    setChatHistory([...chatHistory, newMsg]);
    setMsgText('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chatHistory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={[
            styles.msgBubble, 
            item.self ? styles.msgSelf : styles.msgOther,
            { backgroundColor: item.self ? theme.colors.primaryContainer : 'white' }
          ]}>
            <Text variant="bodyMedium">{item.message}</Text>
            <Text variant="labelSmall" style={{ alignSelf: 'flex-end', marginTop: 4, opacity: 0.6 }}>
              {item.time}
            </Text>
          </View>
        )}
      />
      
      <View style={styles.inputArea}>
        <TextInput
          placeholder="Type a message..."
          value={msgText}
          onChangeText={setMsgText}
          style={{ flex: 1, backgroundColor: 'transparent', height: 40 }}
          underlineColor="transparent"
        />
        {/* FIX: Connect the onPress to sendMessage */}
        <IconButton icon="send" mode="contained" onPress={sendMessage} size={20} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  msgBubble: { padding: 12, borderRadius: 12, marginBottom: 10, maxWidth: '80%' },
  msgSelf: { alignSelf: 'flex-end', borderBottomRightRadius: 0 },
  msgOther: { alignSelf: 'flex-start', borderBottomLeftRadius: 0 },
  inputArea: { 
    flexDirection: 'row', alignItems: 'center', padding: 10, 
    backgroundColor: 'white', borderTopWidth: 1, borderColor: '#E0E0E0' 
  },
});