import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Habit, CreateHabitInput, UpdateHabitInput } from '../types/habit';
import {
  createTable,
  getAllHabits,
  insertHabit,
  updateHabit,
  deleteHabit,
} from '../database/db';

interface HabitContextValue {
  habits: Habit[];
  loading: boolean;
  addHabit: (input: CreateHabitInput) => Promise<void>;
  editHabit: (input: UpdateHabitInput) => Promise<void>;
  removeHabit: (id: number) => Promise<void>;
  refreshHabits: () => Promise<void>;
}

const HabitContext = createContext<HabitContextValue | undefined>(undefined);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshHabits = useCallback(async () => {
    const all = await getAllHabits();
    setHabits(all);
  }, []);

  useEffect(() => {
    (async () => {
      await createTable();
      await refreshHabits();
      setLoading(false);
    })();
  }, [refreshHabits]);

  const addHabit = async (input: CreateHabitInput) => {
    await insertHabit(input);
    await refreshHabits();
  };

  const editHabit = async (input: UpdateHabitInput) => {
    await updateHabit(input);
    await refreshHabits();
  };

  const removeHabit = async (id: number) => {
    await deleteHabit(id);
    await refreshHabits();
  };

  return (
    <HabitContext.Provider value={{ habits, loading, addHabit, editHabit, removeHabit, refreshHabits }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits(): HabitContextValue {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabits must be used within HabitProvider');
  return ctx;
}
