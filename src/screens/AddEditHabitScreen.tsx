import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useHabits } from '../context/HabitContext';
import { HabitFrequency, HabitStatus } from '../types/habit';

type Props = NativeStackScreenProps<RootStackParamList, 'AddEditHabit'>;

const FREQUENCIES: HabitFrequency[] = ['daily', 'weekly', 'monthly'];
const STATUSES: HabitStatus[] = ['pending', 'done', 'skipped'];

export default function AddEditHabitScreen({ route, navigation }: Props) {
  const { habit } = route.params ?? {};
  const { addHabit, editHabit } = useHabits();

  const [title, setTitle] = useState(habit?.title ?? '');
  const [frequency, setFrequency] = useState<HabitFrequency>(habit?.frequency ?? 'daily');
  const [status, setStatus] = useState<HabitStatus>(habit?.status ?? 'pending');

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Title is required.');
      return;
    }
    if (habit) {
      await editHabit({ id: habit.id, title: title.trim(), frequency, status });
    } else {
      await addHabit({ title: title.trim(), frequency, status });
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Title *</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Drink 8 glasses of water"
        placeholderTextColor="#BDBDBD"
        maxLength={100}
      />

      <Text style={styles.label}>Frequency</Text>
      <View style={styles.group}>
        {FREQUENCIES.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, frequency === f && styles.chipActive]}
            onPress={() => setFrequency(f)}
          >
            <Text style={[styles.chipText, frequency === f && styles.chipTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Status</Text>
      <View style={styles.group}>
        {STATUSES.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, status === s && styles.chipActive]}
            onPress={() => setStatus(s)}
          >
            <Text style={[styles.chipText, status === s && styles.chipTextActive]}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>{habit ? 'Update Habit' : 'Create Habit'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#424242', marginBottom: 8, marginTop: 16 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#212121',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  group: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#6C63FF',
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#6C63FF' },
  chipText: { color: '#6C63FF', fontSize: 14, fontWeight: '500' },
  chipTextActive: { color: '#fff' },
  saveBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
