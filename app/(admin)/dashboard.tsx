import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import { Text, Card, Avatar, ActivityIndicator, IconButton, useTheme, Button, TextInput, Chip, Surface } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';
// Import all real API functions
import { fetchAdminStats, fetchLeaveRequests, updateGatePass, sendBroadcast } from '../../src/services/api'; 
import { colors } from '../../src/constants/colors';

export default function AdminDashboard() {
  const theme = useTheme();
  const router = useRouter();
  const { logout, user } = useAuthStore();
  
  const [stats, setStats] = useState<any>(null);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [noticeText, setNoticeText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [statsData, leavesData] = await Promise.all([fetchAdminStats(), fetchLeaveRequests()]);
      setStats(statsData);
      setLeaves(leavesData as any[]);
    } catch (e) {
      console.error("Dashboard Load Error:", e);
    } finally {
      setLoading(false);
    }
  };

  // --- ACTION: APPROVE/REJECT GATE PASS ---
  const handleLeaveAction = async (id: string, action: 'Approved' | 'Rejected') => {
    // Optimistic UI Update (Remove from list immediately)
    setLeaves(prev => prev.filter(item => item.id !== id));
    
    try {
      await updateGatePass(id, action); // Call Backend
      Alert.alert("Success", `Request marked as ${action}`);
      loadAllData(); // Refresh stats
    } catch (error) {
      Alert.alert("Error", "Failed to update request");
    }
  };

  // --- ACTION: BROADCAST NOTICE ---
  const postNotice = async () => {
    if (!noticeText.trim()) return;
    
    try {
      await sendBroadcast(noticeText, user?.id || '1'); // Call Backend
      Alert.alert("Sent", "Notice posted to Community Chat.");
      setNoticeText('');
    } catch (error) {
      Alert.alert("Error", "Failed to send notice.");
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  if (!stats) return <View style={styles.center}><Text>Failed to load stats.</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: colors.primary }}>Dashboard</Text>
          <Text variant="labelMedium" style={{ color: colors.secondary }}>{new Date().toDateString()}</Text>
        </View>
        <IconButton icon="logout" mode="contained-tonal" onPress={() => { logout(); router.replace('/(auth)/login'); }} />
      </View>

      {/* 1. ANALYTICS CHART */}
      <Text variant="titleMedium" style={styles.sectionTitle}>Occupancy Trend</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: ["Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{ data: [20, 35, 40, stats.occupiedRooms || 45, stats.occupiedRooms || 50] }] 
          }}
          width={Dimensions.get("window").width - 32}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(103, 80, 164, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" }
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>

      {/* 2. QUICK STATS ROW */}
      <View style={styles.statsRow}>
        <Surface style={styles.statCard} elevation={2}>
          <Avatar.Icon size={40} icon="cash" style={{backgroundColor: '#FFF3E0'}} color="#F57C00" />
          <Text variant="titleLarge" style={{fontWeight:'bold', marginTop: 5}}>₹{(stats.pendingFees/1000).toFixed(0)}k</Text>
          <Text variant="labelSmall">Due Fees</Text>
        </Surface>
        <Surface style={styles.statCard} elevation={2}>
          <Avatar.Icon size={40} icon="alert-circle" style={{backgroundColor: '#FFEBEE'}} color="#D32F2F" />
          <Text variant="titleLarge" style={{fontWeight:'bold', marginTop: 5}}>{stats.pendingComplaints}</Text>
          <Text variant="labelSmall">Issues</Text>
        </Surface>
        <Surface style={styles.statCard} elevation={2}>
           <Avatar.Icon size={40} icon="bed" style={{backgroundColor: '#E8F5E9'}} color="#388E3C" />
           <Text variant="titleLarge" style={{fontWeight:'bold', marginTop: 5}}>{stats.occupiedRooms}</Text>
           <Text variant="labelSmall">Occupied</Text>
        </Surface>
      </View>

      {/* 3. GATE PASS REQUESTS */}
      <Text variant="titleMedium" style={styles.sectionTitle}>Gate Pass Requests ({leaves.length})</Text>
      {leaves.length === 0 ? (
        <Card style={styles.card}><Card.Content><Text style={{textAlign:'center', color:'#888'}}>No pending requests.</Text></Card.Content></Card>
      ) : (
        leaves.map((leave) => (
          <Card key={leave.id} style={styles.leaveCard}>
            <Card.Content>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                 <View>
                    <Text variant="titleMedium" style={{fontWeight:'bold'}}>{leave.User?.name || 'Student'} <Text style={{color: colors.secondary}}>({leave.User?.roomNumber})</Text></Text>
                    <Text variant="bodySmall">{leave.reason}</Text>
                    <Chip icon="calendar" style={{marginTop:5, height: 28}} textStyle={{fontSize: 10}} compact>{leave.from} - {leave.to}</Chip>
                 </View>
                 <View style={{gap: 5}}>
                    <Button mode="contained" compact buttonColor="green" onPress={() => handleLeaveAction(leave.id, 'Approved')}>Approve</Button>
                    <Button mode="contained-tonal" compact buttonColor="#FFEBEE" textColor="red" onPress={() => handleLeaveAction(leave.id, 'Rejected')}>Reject</Button>
                 </View>
              </View>
            </Card.Content>
          </Card>
        ))
      )}

      {/* 4. RECENT ACTIVITY */}
      <Text variant="titleMedium" style={styles.sectionTitle}>Recent Activity</Text>
      <Card style={styles.card}>
        <Card.Content>
          {stats.recentActivities && stats.recentActivities.map((act: any) => (
             <View key={act.id} style={{flexDirection:'row', alignItems:'center', marginBottom: 10}}>
                <Avatar.Icon size={30} icon={act.icon} style={{backgroundColor:'#F0F0F0'}} color="#666"/>
                <View style={{marginLeft:10}}>
                   <Text variant="bodyMedium">{act.text}</Text>
                   <Text variant="labelSmall" style={{color:'#888'}}>{act.time}</Text>
                </View>
             </View>
          ))}
          {stats.recentActivities?.length === 0 && <Text style={{color:'#888', fontStyle:'italic'}}>No recent activity</Text>}
        </Card.Content>
      </Card>

      {/* 5. BROADCAST NOTICE */}
      <Text variant="titleMedium" style={styles.sectionTitle}>Broadcast Notice</Text>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Announcement"
            placeholder="e.g. Water supply cut tomorrow..."
            value={noticeText}
            onChangeText={setNoticeText}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={{backgroundColor:'white', marginBottom: 10}}
          />
          <Button mode="contained" icon="bullhorn" onPress={postNotice} disabled={!noticeText}>
            Send to All Students
          </Button>
        </Card.Content>
      </Card>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginTop: 40, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontWeight: 'bold', marginBottom: 10, marginTop: 10, marginLeft: 5 },
  chartContainer: { alignItems: 'center', marginBottom: 10 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: { flex: 1, padding: 15, borderRadius: 12, backgroundColor: 'white', alignItems: 'center' },
  card: { backgroundColor: 'white', borderRadius: 12, marginBottom: 10 },
  leaveCard: { backgroundColor: 'white', borderRadius: 12, marginBottom: 8, borderLeftWidth: 4, borderLeftColor: colors.primary }
});