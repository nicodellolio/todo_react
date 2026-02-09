import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo, SleepResult, ActiveSleepSession } from '../types';

const STORAGE_KEYS = {
  TODOS: '@todos',
  SLEEP_RESULTS: '@sleep_results',
  LEGACY_SLEEP_RESULTS: '@sleepResults',
  ACTIVE_SLEEP_SESSION: '@active_sleep_session',
};

export const getTodos = async (): Promise<Todo[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.TODOS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error reading todos', e);
    return [];
  }
};

export const saveTodos = async (todos: Todo[]) => {
  try {
    const jsonValue = JSON.stringify(todos);
    await AsyncStorage.setItem(STORAGE_KEYS.TODOS, jsonValue);
  } catch (e) {
    console.error('Error saving todos', e);
  }
};

export const addTodo = async (todo: Todo) => {
  const todos = await getTodos();
  const newTodos = [...todos, todo];
  await saveTodos(newTodos);
  return newTodos;
};

export const updateTodo = async (updatedTodo: Todo) => {
  const todos = await getTodos();
  const newTodos = todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t));
  await saveTodos(newTodos);
  return newTodos;
};

export const deleteTodo = async (id: string) => {
  const todos = await getTodos();
  const newTodos = todos.filter((t) => t.id !== id);
  await saveTodos(newTodos);
  return newTodos;
};

export const clearCompletedTodos = async () => {
  const todos = await getTodos();
  const newTodos = todos.filter((t) => !t.completed);
  await saveTodos(newTodos);
  return newTodos;
};

export const getSleepResults = async (): Promise<SleepResult[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SLEEP_RESULTS);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }

    const legacyValue = await AsyncStorage.getItem(
      STORAGE_KEYS.LEGACY_SLEEP_RESULTS,
    );
    if (legacyValue != null) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SLEEP_RESULTS,
        legacyValue,
      );
      await AsyncStorage.removeItem(STORAGE_KEYS.LEGACY_SLEEP_RESULTS);
      return JSON.parse(legacyValue);
    }

    return [];
  } catch (e) {
    console.error('Error reading sleep results', e);
    return [];
  }
};

export const saveSleepResults = async (results: SleepResult[]) => {
  try {
    const jsonValue = JSON.stringify(results);
    await AsyncStorage.setItem(STORAGE_KEYS.SLEEP_RESULTS, jsonValue);
  } catch (e) {
    console.error('Error saving sleep results', e);
  }
};

export const clearSleepResults = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SLEEP_RESULTS);
  } catch (e) {
    console.error('Error clearing sleep results', e);
  }
};

export const getActiveSleepSession = async (): Promise<ActiveSleepSession | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(
      STORAGE_KEYS.ACTIVE_SLEEP_SESSION,
    );
    if (!jsonValue) return null;
    return JSON.parse(jsonValue);
  } catch (e) {
    console.error('Error reading active sleep session', e);
    return null;
  }
};

export const saveActiveSleepSession = async (
  session: ActiveSleepSession,
): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(session);
    await AsyncStorage.setItem(
      STORAGE_KEYS.ACTIVE_SLEEP_SESSION,
      jsonValue,
    );
  } catch (e) {
    console.error('Error saving active sleep session', e);
  }
};

export const clearActiveSleepSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_SLEEP_SESSION);
  } catch (e) {
    console.error('Error clearing active sleep session', e);
  }
};
