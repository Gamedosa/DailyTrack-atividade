import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useHabits } from '../context/HabitContext';
import { Habit } from '../types/habit';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const STATUS_COLORS: Record<string, string> = {
  pending: '#FFA500',
  done: '#4CAF50',
  skipped: '#9E9E9E',
};

const FREQ_COLORS: Record<string, string> = {
  daily: '#6C63FF',
  weekly: '#03A9F4',
  monthly: '#E91E63',
};

export default function HomeScreen({ navigation }: Props) {
  const { habits, loading, removeHabit } = useHabits();

  const handleDelete = (habit: Habit) => {
    Alert.alert('Delete Habit', `Are you sure you want to delete "${habit.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeHabit(habit.id) },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={habits.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>
              No habits yet.{'\n'}Tap + to add your first habit!
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('HabitDetail', { habitId: item.id })}
          >
            <View style={styles.cardContent}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.badges}>
                <View style={[styles.badge, { backgroundColor: FREQ_COLORS[item.frequency] }]}>
                  <Text style={styles.badgeText}>{item.frequency}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: STATUS_COLORS[item.status] }]}>
                  <Text style={styles.badgeText}>{item.status}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
              <Text style={styles.deleteBtnText}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditHabit', {})}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1 },
  list: { padding: 16 },
  emptyText: { fontSize: 16, color: '#9E9E9E', textAlign: 'center', lineHeight: 26 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardContent: { flex: 1 },
  title: { fontSize: 17, fontWeight: '600', color: '#212121', marginBottom: 8 },
  badges: { flexDirection: 'row', gap: 8 },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '500' },
  deleteBtn: { padding: 8 },
  deleteBtnText: { color: '#E53935', fontSize: 18, fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    backgroundColor: '#6C63FF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#6C63FF',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },
});
