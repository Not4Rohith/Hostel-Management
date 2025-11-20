import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';
import { colors } from '../../src/constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = (role: 'student' | 'admin') => {
    // 1. Save user to store
    login(role);
    // 2. Navigate to the correct group
    if (role === 'student') {
      router.replace('/(student)/dashboard');
    } else {
      router.replace('/(admin)/dashboard');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="displaySmall" style={styles.title}>HostelMate</Text>
      <Text variant="bodyLarge" style={styles.subtitle}>Manage your stay with ease</Text>

      <TextInput
        label="Email / Roll No"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />

      {/* Mock Buttons for Development */}
      <View style={styles.buttonGap}>
        <Button mode="contained" onPress={() => handleLogin('student')}>
          Login as Student
        </Button>
        <Button mode="outlined" onPress={() => handleLogin('admin')}>
          Login as Admin
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 40,
    color: colors.secondary,
  },
  input: {
    marginBottom: 15,
  },
  buttonGap: {
    marginTop: 20,
    gap: 10,
  },
});