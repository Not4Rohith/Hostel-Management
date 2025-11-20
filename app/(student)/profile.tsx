import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Avatar, List, Switch, Button, Divider, Surface, useTheme, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';
import { fetchStudentData } from '../../src/services/api';
import { colors } from '../../src/constants/colors';
import * as Linking from 'expo-linking';

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await fetchStudentData();
    setUser(data);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/login');
        } 
      }
    ]);
  };

  // Function to open phone dialer
  const dialNumber = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  if (!user) return <View />;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* --- HEADER SECTION --- */}
      <View style={[styles.headerBackground, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.headerContent}>
          <Avatar.Image size={100} source={{ uri: user.profileImage }} style={styles.avatar} />
          <Text variant="headlineMedium" style={styles.nameText}>{user.name}</Text>
          <Text variant="bodyLarge" style={styles.courseText}>{user.course}</Text>
          
          <View style={styles.idTag}>
             <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>ID: {user.id.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      {/* --- HOSTEL INFO CARD --- */}
      <View style={styles.contentContainer}>
        <Surface style={styles.infoCard} elevation={2}>
          <View style={styles.infoRow}>
             <InfoItem label="Room No" value={user.roomNumber} icon="door" />
             <View style={styles.verticalDivider} />
             <InfoItem label="Block" value={user.block} icon="office-building" />
             <View style={styles.verticalDivider} />
             <InfoItem label="Bed ID" value={user.bedId} icon="bed" />
          </View>
        </Surface>

        {/* --- CONTACT DETAILS --- */}
        <List.Section>
          <List.Subheader style={styles.subheader}>Personal Details</List.Subheader>
          
          <List.Item
            title={user.email}
            description="Email"
            left={props => <List.Icon {...props} icon="email-outline" />}
          />
          <Divider />
          <List.Item
            title={user.phone}
            description="Phone"
            left={props => <List.Icon {...props} icon="phone-outline" />}
          />
           <Divider />
          <List.Item
            title={user.bloodGroup}
            description="Blood Group"
            left={props => <List.Icon {...props} icon="water-outline" color={colors.error} />}
          />
        </List.Section>

        {/* --- GUARDIAN INFO (Crucial for Hostels) --- */}
        <List.Section>
          <List.Subheader style={styles.subheader}>Emergency Contact</List.Subheader>
          <Surface style={styles.guardianCard} elevation={1}>
            <List.Item
              title={user.guardianName}
              description="Guardian / Parent"
              left={props => <List.Icon {...props} icon="shield-account-outline" />}
              right={props => (
                <IconButton 
                  icon="phone" 
                  mode="contained" 
                  containerColor={theme.colors.primaryContainer} 
                  iconColor={theme.colors.primary}
                  onPress={() => dialNumber(user.guardianPhone)}
                />
              )}
            />
          </Surface>
        </List.Section>

        {/* --- APP SETTINGS --- */}
        <List.Section>
          <List.Subheader style={styles.subheader}>Settings</List.Subheader>
          
          <List.Item
            title="Push Notifications"
            left={props => <List.Icon {...props} icon="bell-outline" />}
            right={() => <Switch value={notifications} onValueChange={setNotifications} color={colors.primary} />}
          />
          <Divider />
          <List.Item
            title="Change Password"
            left={props => <List.Icon {...props} icon="lock-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log("Nav to Change Password")}
          />
          <Divider />
          <List.Item
            title="Help & Support"
            left={props => <List.Icon {...props} icon="help-circle-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Section>

        {/* --- LOGOUT BUTTON --- */}
        <View style={styles.logoutContainer}>
          <Button 
            mode="outlined" 
            textColor={colors.error} 
            style={{ borderColor: colors.error }} 
            icon="logout"
            onPress={handleLogout}
          >
            Logout
          </Button>
          <Text style={styles.versionText}>App Version 1.0.0</Text>
        </View>

      </View>
    </ScrollView>
  );
}

// Helper Component for the Top Row
const InfoItem = ({ label, value, icon }: { label: string, value: string, icon: string }) => (
  <View style={{ alignItems: 'center', flex: 1 }}>
    <Avatar.Icon size={32} icon={icon} style={{ backgroundColor: '#F0F0F0', marginBottom: 4 }} color="#666" />
    <Text variant="labelSmall" style={{ color: '#888' }}>{label}</Text>
    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerBackground: {
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  avatar: {
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
  },
  nameText: {
    color: 'white',
    fontWeight: 'bold',
  },
  courseText: {
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 10,
  },
  idTag: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: -25, // Pulls content up to overlap the header
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E0E0E0',
  },
  subheader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  guardianCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  logoutContainer: {
    marginTop: 20,
    marginBottom: 40,
    gap: 10,
  },
  versionText: {
    textAlign: 'center',
    color: '#AAA',
    fontSize: 12,
  },
});