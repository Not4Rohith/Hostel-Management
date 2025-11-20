import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Searchbar, Card, Avatar, Portal, Modal, IconButton, Button, Chip, useTheme, Divider } from 'react-native-paper';
import { fetchRooms } from '../../src/services/api';
import { colors } from '../../src/constants/colors';

export default function RoomsScreen() {
  const theme = useTheme();
  const [rooms, setRooms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await fetchRooms();
    setRooms(data as any[]);
  };

  // --- SEARCH LOGIC ---
  // If search text exists, we look inside EVERY room's occupants list
  const filteredStudents = searchQuery 
    ? rooms.flatMap(r => r.occupants.map((s: any) => ({ ...s, roomNo: r.roomNo })))
           .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleRoomPress = (room: any) => {
    setSelectedRoom(room);
    setModalVisible(true);
  };

  // --- RENDER: ROOM GRID ITEM ---
  const renderRoom = ({ item }: { item: any }) => {
    const isFull = item.occupants.length >= item.capacity;
    const percent = item.occupants.length / item.capacity;
    
    return (
      <Card 
        style={[styles.roomCard, isFull ? { borderColor: colors.error } : { borderColor: 'green' }]} 
        mode="outlined"
        onPress={() => handleRoomPress(item)}
      >
        <View style={styles.roomInner}>
          <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>{item.roomNo}</Text>
          
          {/* Visual Bed Indicators (The "Good Looking" Part) */}
          <View style={styles.bedRow}>
            {Array.from({ length: item.capacity }).map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.bedDot, 
                  { backgroundColor: index < item.occupants.length ? theme.colors.primary : '#E0E0E0' }
                ]} 
              />
            ))}
          </View>

          <Text variant="labelSmall" style={{ color: isFull ? colors.error : 'green', marginTop: 5 }}>
            {isFull ? 'FULL' : `${item.capacity - item.occupants.length} Beds Left`}
          </Text>
        </View>
      </Card>
    );
  };

  // --- RENDER: SEARCH RESULT ITEM ---
  const renderStudentResult = ({ item }: { item: any }) => (
    <Card style={{ marginBottom: 10, backgroundColor: 'white' }} onPress={() => {
       // Find the room object for this student and open modal
       const parentRoom = rooms.find(r => r.roomNo === item.roomNo);
       handleRoomPress(parentRoom);
    }}>
      <Card.Title
        title={item.name}
        subtitle={`${item.rollNo} • Room ${item.roomNo}`}
        left={(props) => <Avatar.Text {...props} size={40} label={item.name.substring(0,2)} />}
        right={(props) => <IconButton {...props} icon="chevron-right" />}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Search Student Name or Roll No..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={{ minHeight: 0 }} // Fixes height issues on some Androids
        />
      </View>

      {/* Content Switcher */}
      {searchQuery ? (
        // SEARCH MODE
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.rollNo}
          contentContainerStyle={styles.listContent}
          renderItem={renderStudentResult}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No student found.</Text>}
        />
      ) : (
        // GRID MODE
        <View style={{ flex: 1 }}>
          <Text variant="titleMedium" style={styles.gridTitle}>All Rooms</Text>
          <FlatList
            data={rooms}
            keyExtractor={(item) => item.roomNo}
            numColumns={3} // 3 items per row
            contentContainerStyle={styles.gridContent}
            renderItem={renderRoom}
          />
        </View>
      )}

      {/* --- ROOM DETAIL MODAL --- */}
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
          {selectedRoom && (
            <>
              <View style={styles.modalHeader}>
                <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>Room {selectedRoom.roomNo}</Text>
                <Chip icon="bed">{selectedRoom.occupants.length} / {selectedRoom.capacity} Occupied</Chip>
              </View>
              <Divider style={{ marginVertical: 10 }} />
              
              {/* Occupants List */}
              <Text variant="titleMedium" style={{ marginBottom: 10 }}>Occupants</Text>
              {selectedRoom.occupants.length === 0 ? (
                <Text style={{ fontStyle: 'italic', color: '#888' }}>This room is empty.</Text>
              ) : (
                selectedRoom.occupants.map((student: any, index: number) => (
                  <View key={index} style={styles.studentRow}>
                    <Avatar.Text size={40} label={student.bed} style={{ backgroundColor: theme.colors.secondaryContainer }} color={theme.colors.onSecondaryContainer} />
                    <View style={{ marginLeft: 15, flex: 1 }}>
                      <Text variant="bodyLarge" style={{ fontWeight: 'bold' }}>{student.name}</Text>
                      <Text variant="bodySmall">{student.rollNo}</Text>
                    </View>
                    <IconButton icon="phone" size={20} onPress={() => console.log('Call', student.phone)} />
                  </View>
                ))
              )}

              <Button mode="contained" onPress={() => setModalVisible(false)} style={{ marginTop: 20 }}>
                Close
              </Button>
            </>
          )}
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { padding: 16, backgroundColor: 'white', elevation: 2 },
  searchBar: { backgroundColor: '#F0F0F0', borderRadius: 10 },
  
  // Grid Styles
  gridTitle: { marginLeft: 16, marginTop: 10, fontWeight: 'bold', color: '#666' },
  gridContent: { padding: 10 },
  roomCard: { 
    flex: 1, margin: 5, backgroundColor: 'white', 
    borderWidth: 1, borderRadius: 12, elevation: 0 
  },
  roomInner: { padding: 10, alignItems: 'center', justifyContent: 'center', minHeight: 100 },
  bedRow: { flexDirection: 'row', gap: 5, marginVertical: 8 },
  bedDot: { width: 12, height: 12, borderRadius: 6 },
  
  // Search List Styles
  listContent: { padding: 16 },
  
  // Modal Styles
  modal: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 15, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  studentRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }
});