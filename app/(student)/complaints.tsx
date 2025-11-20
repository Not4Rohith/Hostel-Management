import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, FAB, Modal, Portal, TextInput, Button, ActivityIndicator, HelperText } from 'react-native-paper';
import { fetchComplaints, submitComplaint } from '../../src/services/api';
import ComplaintCard from '../../src/components/cards/ComplaintCard';
import { colors } from '../../src/constants/colors';
import { useRouter } from 'expo-router';

export default function ComplaintsScreen() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    const data = await fetchComplaints();
    setComplaints(data as any[]);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!title || !category) return; // Basic validation

    setSubmitting(true);
    const newComplaint = {
      id: Math.random(), // Temporary ID
      title,
      category,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0] // Today's date
    };

    await submitComplaint(newComplaint);
    
    // Update UI instantly
    setComplaints([newComplaint, ...complaints]);
    setSubmitting(false);
    hideModal();
  };

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setTitle('');
    setCategory('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
         <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: colors.primary }}>My Complaints</Text>
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ComplaintCard 
              title={item.title} 
              category={item.category} 
              status={item.status} 
              date={item.date} 
            />
          )}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No complaints found.</Text>}
        />
      )}

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        label="New Complaint"
        style={styles.fab}
        onPress={showModal}
        color="white"
      />

      {/* Add Complaint Modal */}
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
          <Text variant="titleLarge" style={{ marginBottom: 20, fontWeight: 'bold' }}>Report an Issue</Text>
          
          <TextInput
            label="What's wrong?"
            placeholder="e.g. Fan not working"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
          />
          
          <TextInput
            label="Category"
            placeholder="e.g. Electrical, Plumbing"
            value={category}
            onChangeText={setCategory}
            mode="outlined"
            style={styles.input}
          />

          <Button 
            mode="contained" 
            onPress={handleSubmit} 
            loading={submitting} 
            style={{ marginTop: 10 }}
          >
            Submit Report
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    marginTop: 40, // Space for status bar
    marginBottom: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  input: {
    marginBottom: 15,
  }
});