import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Avatar, List, Divider, FAB, ActivityIndicator, Badge, Portal, Modal, Searchbar, Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { fetchChats, ChatThread, MOCK_CHATS, MOCK_ALL_STUDENTS } from '../../src/services/api';
import { colors } from '../../src/constants/colors';

export default function InboxScreen() {
  const router = useRouter();
  const [chats, setChats] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    const data = await fetchChats();
    setChats(data as ChatThread[]);
    setLoading(false);
  };

  const openChat = (id: string, name: string) => {
    setVisible(false);
    // Push adds to the stack, so "Back" will return here
    router.push({ pathname: '/messages/chat_detail', params: { id, name } });
  };

  const handleStartNewChat = (student: any) => {
    const existingChat = chats.find(c => c.id === student.id);
    if (!existingChat) {
      const newThread: ChatThread = {
        id: student.id,
        name: student.name,
        lastMessage: 'Start a conversation',
        unread: 0,
        messages: []
      };
      MOCK_CHATS.push(newThread);
    }
    openChat(student.id, student.name);
  };

  const filteredStudents = MOCK_ALL_STUDENTS.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <ActivityIndicator style={{marginTop: 50}} />;

  return (
    <View style={styles.container}>
      {/* --- NEW HEADER WITH BACK BUTTON --- */}
      <Appbar.Header style={{backgroundColor: 'white', elevation: 0}}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Messages" titleStyle={{fontWeight:'bold', color: colors.primary}} />
      </Appbar.Header>

      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <>
            <List.Item
              title={item.name}
              description={item.lastMessage}
              descriptionNumberOfLines={1}
              left={props => <Avatar.Text size={45} label={item.name.substring(0,2)} style={{backgroundColor: colors.primaryContainer}} />}
              right={props => item.unread > 0 ? <Badge style={{alignSelf:'center'}}>{item.unread}</Badge> : null}
              onPress={() => openChat(item.id, item.name)}
              style={{paddingVertical: 10}}
            />
            <Divider />
          </>
        )}
        ListEmptyComponent={<Text style={{textAlign:'center', marginTop: 20, color:'#888'}}>No conversations yet.</Text>}
      />
      
      <FAB icon="plus" style={styles.fab} onPress={() => setVisible(true)} color="white" />

      <Portal>
        <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.modal}>
          <Text variant="titleLarge" style={{fontWeight:'bold', marginBottom: 10}}>New Message</Text>
          <Searchbar 
            placeholder="Search Name..." 
            onChangeText={setSearchQuery} 
            value={searchQuery} 
            style={{marginBottom: 10, backgroundColor: '#F0F0F0'}} 
            elevation={0}
          />
          <FlatList
            data={filteredStudents}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleStartNewChat(item)}>
                <View style={styles.userRow}>
                  <Avatar.Text size={40} label={item.avatar} style={{backgroundColor: '#E0E0E0'}} />
                  <Text variant="bodyLarge" style={{marginLeft: 15, fontWeight: '500'}}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: colors.primary },
  modal: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 15, height: '60%' },
  userRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }
});