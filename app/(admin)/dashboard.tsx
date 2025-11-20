import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function AdminDashboard() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="headlineMedium">Admin Dashboard</Text>
      <Text>Manage Rooms & Complaints here</Text>
      
      <Button 
        mode="contained" 
        onPress={() => {
          logout();
          router.replace('/(auth)/login');
        }}
        style={{ marginTop: 20 }}
      >
        Logout
      </Button>
    </View>
  );
}