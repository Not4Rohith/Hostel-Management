import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Text, FAB, Modal, Portal, TextInput, Button, ActivityIndicator, SegmentedButtons, Card, Chip, useTheme } from 'react-native-paper';
import { fetchComplaints, submitComplaint, fetchLeaveRequests, submitLeaveRequest } from '../../src/services/api';
import { colors } from '../../src/constants/colors';
import ComplaintCard from '../../src/components/cards/ComplaintCard';

export default function HelpScreen() {
  const theme = useTheme();
  const [view, setView] = useState('issues'); // 'issues' or 'gatepass'
  const [loading, setLoading] = useState(false);
  
  // --- STATES FOR ISSUES ---
  const [complaints, setComplaints] = useState<any[]>([]);
  const [issueModal, setIssueModal] = useState(false);
  const [newIssue, setNewIssue] = useState({ title: '', category: '' });

  // --- STATES FOR GATE PASS ---
  const [leaves, setLeaves] = useState<any[]>([]);
  const [leaveModal, setLeaveModal] = useState(false);
  const [newLeave, setNewLeave] = useState({ reason: '', from: '', to: '' });

  useEffect(() => {
    loadData();
  }, [view]);

  const loadData = async () => {
    setLoading(true);
    if (view === 'issues') {
      const data = await fetchComplaints();
      setComplaints(data as any[]);
    } else {
      const data = await fetchLeaveRequests();
      setLeaves(data as any[]);
    }
    setLoading(false);
  };

  // --- SUBMIT ISSUE ---
  const handleIssueSubmit = async () => {
    if (!newIssue.title || !newIssue.category) return;
    const payload = { id: Math.random(), ...newIssue, status: 'Pending', date: 'Today' };
    await submitComplaint(payload);
    setComplaints([payload, ...complaints]);
    setIssueModal(false);
    setNewIssue({ title: '', category: '' });
  };

  // --- SUBMIT LEAVE ---
  const handleLeaveSubmit = async () => {
    if (!newLeave.reason || !newLeave.from) return;
    const payload = { 
      id: Math.random().toString(), 
      name: 'Rohith', // Hardcoded for now (in real app, get from User Store)
      room: '302', 
      status: 'Pending',
      ...newLeave 
    };
    await submitLeaveRequest(payload);
    setLeaves([payload, ...leaves]);
    setLeaveModal(false);
    setNewLeave({ reason: '', from: '', to: '' });
  };

  // --- RENDERERS ---
  const renderIssues = () => (
    <>
      <FlatList
        data={complaints}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <ComplaintCard title={item.title} category={item.category} status={item.status} date={item.date} />
        )}
      />
      <FAB icon="plus" label="Report Issue" style={styles.fab} onPress={() => setIssueModal(true)} color="white" />
    </>
  );

  const renderGatePass = () => (
    <>
      <FlatList
        data={leaves}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title 
              title="Gate Pass Request"
              subtitle={`${item.from} - ${item.to}`}
              right={(props) => <Chip style={{marginRight:10, backgroundColor: item.status === 'Approved' ? '#E8F5E9' : '#FFEBEE'}}>{item.status}</Chip>}
            />
            <Card.Content>
              <Text variant="bodyMedium">Reason: {item.reason}</Text>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={<Text style={{textAlign:'center', marginTop: 20, color:'#888'}}>No leave history.</Text>}
      />
      <FAB icon="walk" label="Apply Leave" style={styles.fab} onPress={() => setLeaveModal(true)} color="white" />
    </>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
         <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: colors.primary, marginBottom: 15 }}>Help & Requests</Text>
         <SegmentedButtons
          value={view}
          onValueChange={setView}
          buttons={[
            { value: 'issues', label: 'Maintenance', icon: 'tools' },
            { value: 'gatepass', label: 'Gate Pass', icon: 'door-open' },
          ]}
        />
      </View>

      {/* Content */}
      <View style={{flex: 1, padding: 16}}>
        {loading ? <ActivityIndicator /> : (view === 'issues' ? renderIssues() : renderGatePass())}
      </View>

      {/* --- MODAL: REPORT ISSUE --- */}
      <Portal>
        <Modal visible={issueModal} onDismiss={() => setIssueModal(false)} contentContainerStyle={styles.modal}>
          <Text variant="titleLarge" style={{fontWeight:'bold', marginBottom: 10}}>Report Issue</Text>
          <TextInput label="Problem" value={newIssue.title} onChangeText={t => setNewIssue({...newIssue, title: t})} mode="outlined" style={styles.input} />
          <TextInput label="Category (e.g. Electrical)" value={newIssue.category} onChangeText={t => setNewIssue({...newIssue, category: t})} mode="outlined" style={styles.input} />
          <Button mode="contained" onPress={handleIssueSubmit} style={{marginTop: 10}}>Submit Report</Button>
        </Modal>
      </Portal>

      {/* --- MODAL: APPLY LEAVE --- */}
      <Portal>
        <Modal visible={leaveModal} onDismiss={() => setLeaveModal(false)} contentContainerStyle={styles.modal}>
          <Text variant="titleLarge" style={{fontWeight:'bold', marginBottom: 10}}>Apply Gate Pass</Text>
          <TextInput label="Reason for Leave" value={newLeave.reason} onChangeText={t => setNewLeave({...newLeave, reason: t})} mode="outlined" style={styles.input} />
          <View style={{flexDirection:'row', gap: 10}}>
             <TextInput label="From (DD/MM)" value={newLeave.from} onChangeText={t => setNewLeave({...newLeave, from: t})} mode="outlined" style={[styles.input, {flex:1}]} />
             <TextInput label="To (DD/MM)" value={newLeave.to} onChangeText={t => setNewLeave({...newLeave, to: t})} mode="outlined" style={[styles.input, {flex:1}]} />
          </View>
          <Button mode="contained" onPress={handleLeaveSubmit} style={{marginTop: 10}}>Request Pass</Button>
        </Modal>
      </Portal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { padding: 20, paddingTop: 50, backgroundColor: 'white', elevation: 2 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: colors.primary },
  modal: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10 },
  input: { marginBottom: 15 },
  card: { marginBottom: 10, backgroundColor: 'white' }
});