import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useHabits } from '../context/HabitContext';
import { Habit } from '../types/habit';

type Props = NativeStackScreenProps<RootStackParamList, 'HabitDetail'>;

export default function HabitDetailScreen({ route, navigation }: Props) {
  const { habitId } = route.params;
  const { habits, removeHabit } = useHabits();
  const [habit, setHabit] = useState<Habit | undefined>(undefined);

  useEffect(() => {
    const found = habits.find((h) => h.id === habitId);
    if (found) {
      setHabit(found);
    } else {
      // Habit was deleted — navigate back
      navigation.goBack();
    }
  }, [habits, habitId, navigation]);

  const handleDelete = () => {
    if (!habit) return;
    Alert.alert('Delete Habit', `Delete "${habit.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await removeHabit(habit.id);
          navigation.goBack();
        },
      },
    ]);
  };

  if (!habit) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{habit.title}</Text>

      <View style={styles.row}>
        <InfoCard label="Frequency" value={habit.frequency} />
        <InfoCard label="Status" value={habit.status} />
      </View>

      <View style={styles.metaCard}>
        <Text style={styles.metaLabel}>Created</Text>
        <Text style={styles.metaValue}>{new Date(habit.created_at).toLocaleString()}</Text>
        <Text style={styles.metaLabelSpaced}>Last Modified</Text>
        <Text style={styles.metaValue}>{new Date(habit.modified_at).toLocaleString()}</Text>
      </View>

      <TouchableOpacity
        style={styles.editBtn}
        onPress={() => navigation.navigate('AddEditHabit', { habit })}
      >
        <Text style={styles.editBtnText}>Edit Habit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.deleteBtnText}>Delete Habit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#212121', marginBottom: 20 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  infoCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  infoLabel: { fontSize: 12, color: '#9E9E9E', fontWeight: '500', marginBottom: 4 },
  infoValue: { fontSize: 16, color: '#212121', fontWeight: '600', textTransform: 'capitalize' },
  metaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  metaLabel: { fontSize: 12, color: '#9E9E9E', fontWeight: '500' },
  metaLabelSpaced: { fontSize: 12, color: '#9E9E9E', fontWeight: '500', marginTop: 12 },
  metaValue: { fontSize: 15, color: '#424242', fontWeight: '400', marginTop: 4 },
  editBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  editBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  deleteBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E53935',
  },
  deleteBtnText: { color: '#E53935', fontSize: 16, fontWeight: '700' },
});
