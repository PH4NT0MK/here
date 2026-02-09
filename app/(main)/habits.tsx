import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, useColorScheme } from 'react-native';

const Habits = () => {
  const colorScheme = useColorScheme();
  const [habits, setHabits] = useState([
    { id: 1, title: "Morning Meditation", streak: 12, completed: true, frequency: 'Daily' },
    { id: 2, title: "Drink 2L Water", streak: 5, completed: false, frequency: 'Daily' },
    { id: 3, title: "Read 10 Pages", streak: 23, completed: false, frequency: 'Daily' },
    { id: 4, title: "No Sugar", streak: 2, completed: false, frequency: 'Daily' },
    { id: 5, title: "Gym Workout", streak: 3, completed: true, frequency: '3x/Week' },
    { id: 6, title: "Journaling", streak: 47, completed: true, frequency: 'Daily' },
  ]);

  return (
    <ThemedView style={{ flex: 1, backgroundColor: colorScheme === 'light' ? '#fafaf9' : '#1f1f1f' }}>
      {/* Header */}
      <ThemedView style={{ paddingTop: 48, paddingHorizontal: 24, paddingBottom: 16, backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626', borderBottomWidth: 1, borderBottomColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <ThemedText type="title">My Habits</ThemedText>

        <Pressable style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colorScheme === 'light' ? '#292524' : '#fafafa', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}>
          <Ionicons name="add" size={20} color={colorScheme === 'light' ? '#ffffff' : '#1f1f1f'} />
        </Pressable>
      </ThemedView>

      {/* Habits List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, gap: 12 }}>
        {habits.map((habit) => (
          <Pressable
            key={habit.id}
            onPress={() => router.push("/(detail)/habitDetail")}
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46' }}
          >
            <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'transparent' }}>
              <ThemedView style={{ width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: habit.completed ? (colorScheme === 'light' ? '#d1fae5' : '#064e3b') : (colorScheme === 'light' ? '#e7e5e4' : '#3f3f46') }}>
                <Ionicons name={habit.completed ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={habit.completed ? '#10b981' : (colorScheme === 'light' ? '#9ca3af' : '#a1a1aa')} />
              </ThemedView>

              <ThemedView style={{ flexShrink: 1, backgroundColor: 'transparent' }}>
                <ThemedText style={{ fontSize: 15, fontWeight: '600', color: colorScheme === 'light' ? '#292524' : '#fafafa' }}>{habit.title}</ThemedText>
                <ThemedText style={{ fontSize: 12, color: colorScheme === 'light' ? '#78716c' : '#a1a1aa' }}>{habit.streak} day streak • {habit.frequency}</ThemedText>
              </ThemedView>
            </ThemedView>

            <ThemedView style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, backgroundColor: colorScheme === 'light' ? '#f5f5f4' : '#3f3f46' }}>
              <ThemedText style={{ fontSize: 12, fontWeight: '500', color: colorScheme === 'light' ? '#57534e' : '#10b981' }}>Details</ThemedText>
            </ThemedView>
          </Pressable>
        ))}
      </ScrollView>
    </ThemedView>
  );
};

export default Habits;
