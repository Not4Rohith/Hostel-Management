import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Text, TextInput, IconButton, useTheme, Chip } from 'react-native-paper';
import { ChatMessage } from '../../types';

const MOCK_CHAT: ChatMessage[] = [
  { id: '1', user: 'Rohith', message: 'Has the water supply issue been resolved?', time: '10:30 AM', self: true },
  { id: '2', user: 'Warden', message: 'Yes, the plumber just left.', time: '10:35 AM', self: false },
];

// 1. SIMPLE BAD WORD LIST (You can expand this)
const BANNED_WORDS = ['stupid', 'useless', 'trash', 'idiot','fuck'];

export default function ChatSection({ isAdmin = false }: { isAdmin?: boolean }) {
  const theme = useTheme();
  const [msgText, setMsgText] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(MOCK_CHAT);

  const sendMessage = () => {
    if (!msgText.trim()) return;

    // 2. AUTO-MODERATION LOGIC
    const containsBadWord = BANNED_WORDS.some(word => msgText.toLowerCase().includes(word));
    if (containsBadWord) {
      Alert.alert("Message Blocked", "Please keep the conversation respectful. Profanity is not allowed.");
      return;
    }
    
    const newMsg: ChatMessage = { 
      id: Date.now().toString(), 
      user: isAdmin ? 'Admin (Warden)' : 'Me', // Label Admin messages
      message: msgText, 
      time: 'Just now', 
      self: true 
    };
    
    setChatHistory([...chatHistory, newMsg]);
    setMsgText('');
  };

  // 3. DELETE LOGIC
  const handleLongPress = (msg: ChatMessage) => {
    // Admin can delete ANY message. Students can only delete their own.
    if (!isAdmin && !msg.self) return;

    Alert.alert(
      isAdmin ? "Admin Moderation" : "Delete Message",
      isAdmin ? "Do you want to delete this message?" : "Unsend this message?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: 'destructive',
          onPress: () => {
            setChatHistory(prev => prev.filter(m => m.id !== msg.id));
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chatHistory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => handleLongPress(item)} activeOpacity={0.8}>
            <View style={[
              styles.msgBubble, 
              item.self ? styles.msgSelf : styles.msgOther,
              { backgroundColor: item.self ? theme.colors.primaryContainer : 'white' }
            ]}>
              {/* Show Name if it's not me */}
              {!item.self && (
                 <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 2}}>
                    <Text variant="labelSmall" style={{ color: theme.colors.secondary, fontWeight: 'bold' }}>{item.user}</Text>
                    {/* If the sender is Admin, show a Badge */}
                    {item.user.includes('Admin') && <Chip textStyle={{fontSize: 9, height: 10}} style={{height: 20, marginLeft: 5}} compact>MOD</Chip>}
                 </View>
              )}
              
              <Text variant="bodyMedium">{item.message}</Text>
              <Text variant="labelSmall" style={{ alignSelf: 'flex-end', marginTop: 4, opacity: 0.6 }}>
                {item.time}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      
      <View style={styles.inputArea}>
        <TextInput
          placeholder={isAdmin ? "Type as Admin..." : "Type a message..."}
          value={msgText}
          onChangeText={setMsgText}
          style={{ flex: 1, backgroundColor: 'transparent', height: 40 }}
          underlineColor="transparent"
        />
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