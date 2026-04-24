import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddEditHabitScreen from '../screens/AddEditHabitScreen';
import HabitDetailScreen from '../screens/HabitDetailScreen';
import { Habit } from '../types/habit';

export type RootStackParamList = {
  Home: undefined;
  AddEditHabit: { habit?: Habit };
  HabitDetail: { habitId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#6C63FF' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'My Daily Habits' }} />
      <Stack.Screen
        name="AddEditHabit"
        component={AddEditHabitScreen}
        options={({ route }) => ({ title: route.params?.habit ? 'Edit Habit' : 'New Habit' })}
      />
      <Stack.Screen
        name="HabitDetail"
        component={HabitDetailScreen}
        options={{ title: 'Habit Details' }}
      />
    </Stack.Navigator>
  );
}
