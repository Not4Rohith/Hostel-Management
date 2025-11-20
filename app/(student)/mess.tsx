import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Chip, ActivityIndicator, useTheme } from 'react-native-paper';
import { fetchMenu } from '../../src/services/api';
import MealCard from '../../src/components/cards/MealCard';
import { colors } from '../../src/constants/colors';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MessScreen() {
  const theme = useTheme();
  const [menu, setMenu] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const [selectedDay, setSelectedDay] = useState(DAYS[todayIndex] || 'Mon');

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    const data = await fetchMenu();
    setMenu(data);
    setLoading(false);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  const currentMenu = menu[selectedDay] || {}; 

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: colors.primary }}>Weekly Menu</Text>
        <Text variant="bodyMedium" style={{ color: colors.secondary }}>Check what's cooking</Text>
      </View>

      {/* Day Selector */}
      <View style={{ height: 50, marginBottom: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayScroll}>
          {DAYS.map((day) => (
            <Chip
              key={day}
              selected={selectedDay === day}
              onPress={() => setSelectedDay(day)}
              style={selectedDay === day ? { backgroundColor: theme.colors.primaryContainer } : {}}
              showSelectedOverlay
            >
              {day}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* Menu List */}
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>
        {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map((type) => (
           <MealCard 
             key={type}
             type={type} 
             item={currentMenu[type]?.item || 'Loading...'} 
             time={currentMenu[type]?.time || '--'} 
             icon="food" 
           />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, paddingTop: 50, backgroundColor: 'white', marginBottom: 10 },
  dayScroll: { paddingHorizontal: 16, gap: 8 },
  content: { padding: 16 },
});