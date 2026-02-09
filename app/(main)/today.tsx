import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, TouchableOpacity, useColorScheme } from 'react-native';

const HEADER_HEIGHT = 250;

const Today = () => {
  const [habits, setHabits] = useState([
    { id: 1, title: "Morning Meditation", completed: true, streak: 12 },
    { id: 2, title: "Drink 2L Water", completed: false, streak: 5 },
    { id: 3, title: "Read 10 Pages", completed: false, streak: 23 },
    { id: 4, title: "No Sugar", completed: false, streak: 2 },
  ]);

  const toggleHabit = (id: number) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const completedCount = habits.filter(h => h.completed).length;
  const progress = (completedCount / habits.length) * 100;

  const { width } = Dimensions.get('window');
  const colorScheme = useColorScheme();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#fafaf9', dark: '#1f1f1f' }}
      headerImage={
        <ThemedView>
          {/* Background Image */}
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1768822622847-dffee268a9dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080' }}
            style={{ width: width, height: HEADER_HEIGHT, }}
            resizeMode="cover"
          />

          {/* Gradient fade at the bottom */}
          <LinearGradient
            colors={['transparent', colorScheme === 'light' ? '#fafaf9' : '#1f1f1f']} // fade to page background
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 128 }}
          />

          {/* Overlay Text */}
          <ThemedView style={{ position: 'absolute', bottom: 64, left: 24, right: 24, backgroundColor: 'transparent' }}>
            <ThemedText style={{ fontSize: 18, fontWeight: '600', color: '#fafaf9', marginBottom: 4 }}>
              Good Morning, Alex
            </ThemedText>
            <ThemedText style={{ fontSize: 14, color: '#fafaf9' }}>
              {`"Small steps every day lead to big changes."`}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      }
    >
      {/* Content */}
      <ThemedView style={{ paddingBottom: 12, gap: 24 }}>
        {/* Streak & Progress */}
        <ThemedView style={{ flexDirection: 'row', gap: 16 }}>
          {/* Streak */}
          <ThemedView
            style={{
              flex: 1,
              backgroundColor: colorScheme === 'light' ? '#ffffff' : '#1c1c1a',
              padding: 16,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: colorScheme === 'light' ? '#f5f5f4' : '#2a2a27',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <ThemedView style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffe4d5', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="flame" size={20} color="#f97316" />
            </ThemedView>
            <ThemedText style={{ fontSize: 20, fontWeight: '700', color: colorScheme === 'light' ? '#292524' : '#fafaf9' }}>
              47
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 10,
                color: colorScheme === 'light' ? '#78716c' : '#d6d3d1',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Day Streak
            </ThemedText>
          </ThemedView>

          {/* Daily Goal */}
          <ThemedView
            style={{
              flex: 1,
              backgroundColor: colorScheme === 'light' ? '#ffffff' : '#1c1c1a',
              padding: 16,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: colorScheme === 'light' ? '#f5f5f4' : '#2a2a27',
              justifyContent: 'space-between',
            }}
          >
            <ThemedText
              style={{
                fontSize: 10,
                color: colorScheme === 'light' ? '#78716c' : '#d6d3d1',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Daily Goal
            </ThemedText>

            <ThemedText style={{ fontSize: 20, fontWeight: '700', color: colorScheme === 'light' ? '#292524' : '#fafaf9', marginTop: 4 }}>
              {Math.round(progress)}%
            </ThemedText>

            <ThemedView
              style={{
                width: '100%',
                height: 8,
                borderRadius: 4,
                backgroundColor: colorScheme === 'light' ? '#f5f5f4' : '#2a2a27',
                marginTop: 12,
                overflow: 'hidden',
              }}
            >
              <ThemedView style={{ width: `${progress}%`, height: '100%', backgroundColor: '#059669', borderRadius: 4 }} />
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Daily Habits */}
        <ThemedView style={{ gap: 12 }}>
          {habits.map(habit => (
            <TouchableOpacity
              key={habit.id}
              onPress={() => toggleHabit(habit.id)}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: colorScheme === 'light' ? '#ffffff' : '#1c1c1a',
                padding: 16,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: colorScheme === 'light' ? '#f5f5f4' : '#2a2a27',
              }}
            >
              <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'transparent' }}>
                <ThemedView
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: habit.completed ? '#059669' : colorScheme === 'light' ? '#d6d3d1' : '#525252',
                    backgroundColor: habit.completed ? '#059669' : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {habit.completed && <Ionicons name="checkmark" size={14} color="#ffffff" />}
                </ThemedView>

                <ThemedView style={{ backgroundColor: 'transparent' }}>
                  <ThemedText
                    style={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: habit.completed
                        ? '#9ca3af'
                        : colorScheme === 'light'
                          ? '#292524'
                          : '#fafaf9',
                      textDecorationLine: habit.completed ? 'line-through' : 'none',
                    }}
                  >
                    {habit.title}
                  </ThemedText>
                  <ThemedText style={{ fontSize: 10, color: colorScheme === 'light' ? '#a8a29e' : '#a8a29e' }}>
                    {habit.streak} day streak
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ThemedView>

        {/* Quick Journal */}
        <ThemedView
          style={{
            backgroundColor: colorScheme === 'light' ? '#292524' : '#0f0f0e',
            borderRadius: 24,
            padding: 24,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, backgroundColor: 'transparent' }}>
            <Ionicons name="chatbubble-outline" size={18} color="#10b981" />
            <ThemedText style={{ fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, color: '#10b981' }}>
              Reflection
            </ThemedText>
          </ThemedView>

          <ThemedText style={{ fontSize: 16, fontWeight: '500', color: '#ffffff', marginBottom: 12 }}>
            What made you smile today?
          </ThemedText>

          <TouchableOpacity
            onPress={() => router.replace('/(main)/journal')}
            style={{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            <ThemedText style={{ fontSize: 12, fontWeight: '500', color: '#ffffff' }}>
              Write Entry
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>


    </ParallaxScrollView>
  );
};

export default Today;
