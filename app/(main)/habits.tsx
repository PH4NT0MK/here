import { Spinner } from '@/components/spinner';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { toggleCompleteToday } from '@/services/habit';
import { calculateStreaks, isCompletedToday } from '@/services/streak';
import { truncate } from '@/services/utils';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, useColorScheme } from 'react-native';
import { useAuth } from '../../context/authContext';
import { useHabits } from '../../context/habitContext';

const Habits = () => {
  const { user } = useAuth();
  const { habits, refreshHabits, setHabits } = useHabits();

  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    const loadHabits = async () => {
      setLoading(true);
      try {
        refreshHabits(user.uid);
      } catch (err) {
        console.error("Error fetching habits:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHabits();
  }, [user, refreshHabits]);

  if (loading) {
      return <Spinner />;
    }

  return (
    <ThemedView style={{ flex: 1, backgroundColor: colorScheme === 'light' ? '#fafaf9' : '#1f1f1f' }}>
      {/* Header */}
      <ThemedView style={{ paddingTop: 48, paddingHorizontal: 24, paddingBottom: 16, backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626', borderBottomWidth: 1, borderBottomColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <ThemedText type="title">My Habits</ThemedText>
      </ThemedView>

      {/* Habits List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, gap: 12 }}>
        {(loading || !habits) ? <>
          {/* <LoadingIndicator /> */}
        </> : habits.map((habit) => {
          const completedToday = isCompletedToday(habit.completedAt, habit.frequency);

          return (
            <Pressable
              key={habit.id}
              onPress={() => router.push({
                pathname: "/(detail)/habitEntry",
                params: { id: habit.id }
              })}
              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46' }}
            >
              <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'transparent' }}>
                <Pressable
                  onPress={async () => {
                    if (!user?.uid) {
                      return;
                    }

                    const updatedCompletedAt = await toggleCompleteToday(user.uid, habit.id);

                    if (!updatedCompletedAt) {
                      return;
                    }

                    const { currentStreak, longestStreak } = calculateStreaks(updatedCompletedAt, habit.frequency);

                    setHabits(prev => prev.map(h => h.id === habit.id ? { ...h, completedAt: updatedCompletedAt, currentStreak, longestStreak } : h));
                  }}
                >
                  <ThemedView style={{ width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: completedToday ? (colorScheme === 'light' ? '#d1fae5' : '#064e3b') : (colorScheme === 'light' ? '#e7e5e4' : '#3f3f46') }}>
                    <Ionicons name={completedToday ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={completedToday ? '#10b981' : (colorScheme === 'light' ? '#9ca3af' : '#a1a1aa')} />
                  </ThemedView>
                </Pressable>

                <ThemedView style={{ flexShrink: 1, backgroundColor: 'transparent' }}>
                  <ThemedText style={{ fontSize: 15, fontWeight: '600', color: colorScheme === 'light' ? '#292524' : '#fafafa' }}>{truncate(habit.title, 24)}</ThemedText>
                  <ThemedText style={{ fontSize: 12, color: colorScheme === 'light' ? '#78716c' : '#a1a1aa' }}>{habit.currentStreak} day streak • {habit.frequency.type}</ThemedText>
                </ThemedView>

              </ThemedView>
                <ThemedView style={{ marginLeft: 'auto', marginRight: 0, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, backgroundColor: colorScheme === 'light' ? '#f5f5f4' : '#3f3f46' }}>
                  <ThemedText style={{ fontSize: 12, fontWeight: '500', color: colorScheme === 'light' ? '#57534e' : '#10b981' }}>Details</ThemedText>
                </ThemedView>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable
        onPress={() => router.push("/(detail)/habitEntry")}
        style={{ position: 'absolute', right: 24, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: colorScheme === 'light' ? '#292524' : '#fafafa', alignItems: 'center', justifyContent: 'center', elevation: 6 }}
      >
        <Ionicons name="add" size={26} color={colorScheme === 'light' ? '#ffffff' : '#1f1f1f'} />
      </Pressable>
    </ThemedView>
  );
};

export default Habits;
