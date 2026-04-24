export type HabitFrequency = 'daily' | 'weekly' | 'monthly';
export type HabitStatus = 'pending' | 'done' | 'skipped';

export interface Habit {
  id: number;
  title: string;
  frequency: HabitFrequency;
  status: HabitStatus;
  created_at: string; // ISO string
  modified_at: string; // ISO string
}

export type CreateHabitInput = Omit<Habit, 'id' | 'created_at' | 'modified_at'>;
export type UpdateHabitInput = Partial<CreateHabitInput> & { id: number };
