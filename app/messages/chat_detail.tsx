import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, IconButton, useTheme, Appbar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MOCK_CHATS, sendDM, ChatThread } from '../../src/services/api';

export default function ChatDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id, name } = useLocalSearchParams();
  
  const [msgText, setMsgText] = useState('');
  const [thread, setThread] = useState<ChatThread | undefined>(undefined);

  useEffect(() => {
    const chat = MOCK_CHATS.find(c => c.id === id);
    setThread(chat);
  }, [id]);

  const handleSend = async () => {
    if (!msgText.trim() || !id) return;
    const newMsg = { id: Date.now().toString(), text: msgText, sender: 'me' as const, timestamp: Date.now() };
    if (thread) {
        setThread({ ...thread, messages: [...thread.messages, newMsg] });
    }
    await sendDM(id as string, msgText);
    setMsgText('');
  };

  if (!thread) return <View style={{flex:1, justifyContent:'center'}}><Text style={{textAlign:'center'}}>Chat not found</Text></View>;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex:1, backgroundColor:'white'}}>
      
      {/* --- STANDARD HEADER --- */}
      <Appbar.Header style={{backgroundColor: 'white', elevation: 1}}>
        {/* This back action strictly goes to the previous screen (Inbox) */}
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={name as string} />
      </Appbar.Header>

      <FlatList
        data={[...thread.messages].reverse()}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        inverted 
        renderItem={({ item }) => (
          <View style={[
            styles.bubble, 
            item.sender === 'me' ? styles.me : styles.other,
            { backgroundColor: item.sender === 'me' ? theme.colors.primary : '#F0F0F0' }
          ]}>
            <Text style={{ color: item.sender === 'me' ? 'white' : 'black' }}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputArea}>
        <TextInput 
          mode="outlined" 
          value={msgText} 
          onChangeText={setMsgText} 
          placeholder="Message..." 
          style={{flex:1, backgroundColor:'white'}} 
          dense 
          outlineColor="transparent"
          activeOutlineColor="transparent"
        />
        <IconButton icon="send" mode="contained" onPress={handleSend} iconColor="white" containerColor={theme.colors.primary} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bubble: { padding: 12, borderRadius: 20, maxWidth: '80%', marginVertical: 4 },
  me: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  other: { alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  inputArea: { flexDirection: 'row', padding: 10, backgroundColor: 'white', alignItems: 'center', gap: 5, borderTopWidth: 1, borderTopColor: '#f0f0f0' }
});