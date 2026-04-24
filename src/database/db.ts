import * as SQLite from 'expo-sqlite';
import { Habit, CreateHabitInput, UpdateHabitInput } from '../types/habit';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('dailytrack.db');
  }
  return db;
}

export async function createTable(): Promise<void> {
  const database = await getDatabase();
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      frequency TEXT NOT NULL DEFAULT 'daily',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      modified_at TEXT NOT NULL
    );
  `);
}

export async function getAllHabits(): Promise<Habit[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<Habit>('SELECT * FROM habits ORDER BY created_at DESC');
  return rows;
}

export async function getHabitById(id: number): Promise<Habit | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<Habit>('SELECT * FROM habits WHERE id = ?', [id]);
  return row ?? null;
}

export async function insertHabit(input: CreateHabitInput): Promise<number> {
  const database = await getDatabase();
  const now = new Date().toISOString();
  const result = await database.runAsync(
    'INSERT INTO habits (title, frequency, status, created_at, modified_at) VALUES (?, ?, ?, ?, ?)',
    [input.title, input.frequency, input.status, now, now],
  );
  return result.lastInsertRowId;
}

export async function updateHabit(input: UpdateHabitInput): Promise<void> {
  const database = await getDatabase();
  const now = new Date().toISOString();
  const fields: string[] = [];
  const values: (string | number)[] = [];
  if (input.title !== undefined) {
    fields.push('title = ?');
    values.push(input.title);
  }
  if (input.frequency !== undefined) {
    fields.push('frequency = ?');
    values.push(input.frequency);
  }
  if (input.status !== undefined) {
    fields.push('status = ?');
    values.push(input.status);
  }
  fields.push('modified_at = ?');
  values.push(now);
  values.push(input.id);
  await database.runAsync(`UPDATE habits SET ${fields.join(', ')} WHERE id = ?`, values);
}

export async function deleteHabit(id: number): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM habits WHERE id = ?', [id]);
}
