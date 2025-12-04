import { create } from 'zustand';
import type { Habit, HabitCheckin } from '../types';
import { apiService } from '../services/api';

interface HabitsState {
  habits: Habit[];
  checkins: Record<number, HabitCheckin[]>;
  streaks: Record<number, number>;
  isLoading: boolean;
  error: string | null;
  fetchHabits: (activeOnly?: boolean) => Promise<void>;
  createHabit: (habit: {
    name: string;
    description?: string;
    targetType: string;
    targetValue: number;
    category?: string;
  }) => Promise<void>;
  updateHabit: (id: number, habit: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: number) => Promise<void>;
  checkinHabit: (id: number, checkin: { date: string; value?: number; notes?: string }) => Promise<void>;
  fetchHabitCheckins: (id: number, startDate?: string, endDate?: string) => Promise<void>;
}

export const useHabitsStore = create<HabitsState>((set) => ({
  habits: [],
  checkins: {},
  streaks: {},
  isLoading: false,
  error: null,

  fetchHabits: async (activeOnly = false) => {
    set({ isLoading: true, error: null });
    try {
      const habits = await apiService.getHabits(activeOnly);
      set({ habits, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch habits',
        isLoading: false,
      });
    }
  },

  createHabit: async (habit) => {
    set({ isLoading: true, error: null });
    try {
      const newHabit = await apiService.createHabit(habit);
      set((state) => ({
        habits: [...state.habits, newHabit],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create habit',
        isLoading: false,
      });
      throw error;
    }
  },

  updateHabit: async (id, habit) => {
    set({ isLoading: true, error: null });
    try {
      const updatedHabit = await apiService.updateHabit(id, habit);
      set((state) => ({
        habits: state.habits.map((h) => (h.id === id ? updatedHabit : h)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update habit',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteHabit: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.deleteHabit(id);
      set((state) => {
        const newCheckins = { ...state.checkins };
        const newStreaks = { ...state.streaks };
        delete newCheckins[id];
        delete newStreaks[id];
        return {
          habits: state.habits.filter((h) => h.id !== id),
          checkins: newCheckins,
          streaks: newStreaks,
          isLoading: false,
        };
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete habit',
        isLoading: false,
      });
      throw error;
    }
  },

  checkinHabit: async (id, checkin) => {
    set({ isLoading: true, error: null });
    try {
      const newCheckin = await apiService.checkinHabit(id, checkin);
      set((state) => ({
        checkins: {
          ...state.checkins,
          [id]: [...(state.checkins[id] || []), newCheckin],
        },
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to check in habit',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchHabitCheckins: async (id, startDate, endDate) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiService.getHabitCheckins(id, startDate, endDate);
      set((state) => ({
        checkins: { ...state.checkins, [id]: data.checkins },
        streaks: { ...state.streaks, [id]: data.streak },
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch check-ins',
        isLoading: false,
      });
    }
  },
}));

