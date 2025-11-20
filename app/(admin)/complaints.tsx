import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { Text, Card, Chip, Avatar, FAB, Portal, Modal, Button, IconButton, SegmentedButtons, Divider, useTheme } from 'react-native-paper';
import { fetchComplaints } from '../../src/services/api'; // We reuse the same API
import { colors } from '../../src/constants/colors';

export default function AdminComplaintsScreen() {
  const theme = useTheme();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [filter, setFilter] = useState('Pending'); // 'Pending' or 'Resolved'
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // In a real app, you might have a specific admin API.
    // Here we reuse the student one but would typically fetch ALL complaints.
    const data = await fetchComplaints();
    setComplaints(data as any[]);
  };

  // --- ACTIONS ---
  const markResolved = (id: string) => {
    Alert.alert("Confirm Resolve", "Mark this issue as fixed?", [
      { text: "Cancel" },
      { 
        text: "Yes, Resolved", 
        onPress: () => {
          setComplaints(prev => prev.map(c => 
            c.id === id ? { ...c, status: 'Resolved' } : c
          ));
          if (modalVisible) setModalVisible(false);
        }
      }
    ]);
  };

  const filteredData = complaints.filter(c => c.status === filter);

  // --- RENDER ITEM ---
  const renderItem = ({ item }: { item: any }) => (
    <Card 
      style={[styles.card, { borderLeftColor: item.status === 'Pending' ? colors.error : 'green', borderLeftWidth: 5 }]}
      onPress={() => { setSelectedComplaint(item); setModalVisible(true); }}
    >
      <Card.Title
        title={item.title}
        subtitle={`${item.category} • ${item.date}`}
        left={(props) => <Avatar.Icon {...props} icon={item.status === 'Pending' ? 'clock' : 'check'} style={{ backgroundColor: 'transparent' }} color={item.status === 'Pending' ? colors.error : 'green'} />}
        right={(props) => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {item.status === 'Pending' && (
              <Button compact mode="text" textColor="green" onPress={() => markResolved(item.id)}>
                Resolve
              </Button>
            )}
            <IconButton {...props} icon="chevron-right" size={20} />
          </View>
        )}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header & Filter */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginBottom: 15 }}>Issue Tracker</Text>
        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          buttons={[
            { value: 'Pending', label: `Pending (${complaints.filter(c => c.status === 'Pending').length})`, icon: 'alert-circle-outline' },
            { value: 'Resolved', label: 'History', icon: 'history' },
          ]}
        />
      </View>

      {/* List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Avatar.Icon size={60} icon="check-circle-outline" style={{ backgroundColor: '#E8F5E9' }} color="green" />
            <Text variant="titleMedium" style={{ marginTop: 10, color: '#666' }}>All caught up!</Text>
            <Text variant="bodySmall" style={{ color: '#999' }}>No pending issues found.</Text>
          </View>
        }
      />

      {/* --- DETAIL MODAL --- */}
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
          {selectedComplaint && (
            <>
              <View style={styles.modalHeader}>
                <Chip icon="account">Room 302</Chip>
                <Chip 
                  icon={selectedComplaint.status === 'Pending' ? 'alert-circle' : 'check'} 
                  style={{ backgroundColor: selectedComplaint.status === 'Pending' ? '#FFEBEE' : '#E8F5E9' }}
                  textStyle={{ color: selectedComplaint.status === 'Pending' ? colors.error : 'green' }}
                >
                  {selectedComplaint.status}
                </Chip>
              </View>

              <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginTop: 10 }}>{selectedComplaint.title}</Text>
              <Text variant="bodyMedium" style={{ color: colors.secondary, marginBottom: 10 }}>Category: {selectedComplaint.category}</Text>
              
              <Divider />
              
              <View style={{ marginVertical: 15, padding: 15, backgroundColor: '#F5F5F5', borderRadius: 8 }}>
                 <Text variant="bodyMedium">" The fan makes a very loud noise at speed 5. Please fix it urgently. "</Text>
              </View>

              {/* Action Buttons */}
              {selectedComplaint.status === 'Pending' ? (
                <Button 
                  mode="contained" 
                  icon="check" 
                  buttonColor="green" 
                  onPress={() => markResolved(selectedComplaint.id)}
                  style={{ marginTop: 10 }}
                >
                  Mark as Fixed
                </Button>
              ) : (
                <Button mode="outlined" disabled style={{ marginTop: 10 }}>Resolved on {selectedComplaint.date}</Button>
              )}
              
              <Button mode="text" onPress={() => setModalVisible(false)} style={{ marginTop: 5 }}>Close</Button>
            </>
          )}
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { padding: 20, paddingTop: 50, backgroundColor: 'white', elevation: 2 },
  card: { marginBottom: 10, backgroundColor: 'white' },
  emptyState: { alignItems: 'center', marginTop: 50 },
  modal: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 15 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between' }
});