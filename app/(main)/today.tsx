import ActionCard from '@/components/ActionCard';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Spinner } from '@/components/spinner';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getRandomHabitMessage } from '@/constants/habits';
import { getRandomJournalPrompt } from '@/constants/journals';
import { defaultQuotes } from '@/constants/quotes';
import { getCoverImage } from '@/services/customPhoto';
import { toggleCompleteHabit } from '@/services/habit';
import { calculateStreaks, isCompletedToday } from '@/services/streak';
import { truncate } from '@/services/utils';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { useAuth } from '../../context/authContext';
import { useHabits } from '../../context/habitContext';

const HEADER_HEIGHT = 250;

const Today = () => {
  const { profile, user } = useAuth();
  const { habits, setHabits, refreshHabits } = useHabits();

  const [loading, setLoading] = useState(false);

  const [progressValue, setProgressValue] = useState(0);

  const [quotes, setQuotes] = useState(defaultQuotes);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const [coverUri, setCoverUri] = useState<string | null>(null);

  useEffect(() => {
    const loadCover = async () => {
      const savedUri = await getCoverImage();
      if (savedUri) {
        setCoverUri(savedUri);
      }
    };

    loadCover();
  }, []);

  const toggleHabit = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit || !user?.uid) {
      return;
    }

    const updatedCompletedAt = await toggleCompleteHabit(user.uid, habitId);
    if (!updatedCompletedAt) return;

    const { currentStreak, longestStreak } = calculateStreaks(updatedCompletedAt, habit.frequency);

    setHabits(prev =>
      prev.map(h =>
        h.id === habitId
          ? { ...h, completedAt: updatedCompletedAt, currentStreak, longestStreak }
          : h
      )
    );

    setProgressValue(habits.length > 0 ? (habits.filter(h => isCompletedToday(h.completedAt, h.frequency)).length / habits.length) * 100 : 0);
  };

  const { width } = Dimensions.get('window');
  const colorScheme = useColorScheme();

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * quotes.length));
  }, [quotes]);

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

  useEffect(() => {
    setProgressValue(habits.length > 0 ? (habits.filter(h => isCompletedToday(h.completedAt, h.frequency)).length / habits.length) * 100 : 0);
  }, [habits]);

  const getGreeting = (name: string | undefined) => {
    try {
      const hour = new Date().getHours();

      let greeting = "Hello";

      if (hour >= 5 && hour < 12) {
        greeting = "Good Morning";
      } else if (hour >= 12 && hour < 17) {
        greeting = "Good Afternoon";
      } else if (hour >= 17 && hour < 21) {
        greeting = "Good Evening";
      } else {
        greeting = "Good Night";
      }

      return `${greeting}${name ? `, ${name}` : ""}`;
    } catch {
      return `Hello${name ? `, ${name}` : ""}`;
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#fafaf9', dark: '#1f1f1f' }}
      headerImage={
        <ThemedView>
          {/* Background Image */}
          <Image
            source={{ uri: coverUri ? coverUri : 'https://images.unsplash.com/photo-1768822622847-dffee268a9dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080' }}
            style={{ width: width, height: HEADER_HEIGHT, }}
            resizeMode='cover'
          />

          {/* Gradient fade at the bottom */}
          <LinearGradient
            colors={['transparent', colorScheme === 'light' ? '#fafaf9' : '#1f1f1f']}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 128 }}
          />

          {/* Overlay Text */}
          <ThemedView style={{ position: 'absolute', bottom: 64, left: 24, right: 24, backgroundColor: 'transparent' }}>
            <ThemedText style={{ fontSize: 18, fontWeight: '600', color: '#fafaf9', marginBottom: 4 }}>
              {getGreeting(profile?.displayName)}
            </ThemedText>
            <ThemedText style={{ fontSize: 14, color: '#fafaf9' }}>
              {quotes[quoteIndex]}
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
              <Ionicons name='flame' size={20} color='#f97316' />
            </ThemedView>
            <ThemedText style={{ fontSize: 20, fontWeight: '700', color: colorScheme === 'light' ? '#292524' : '#fafaf9' }}>
              {Math.max(0, ...habits.map(h => h.currentStreak))}
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
              {Math.round(progressValue)}%
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
              <ThemedView style={{ width: `${progressValue}%`, height: '100%', backgroundColor: '#059669', borderRadius: 4 }} />
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Daily Habits */}
        <ThemedView style={{ gap: 12 }}>
          {habits.length === 0 && (
            <ActionCard
              topLabel="Habits"
              topIcon="list-outline"
              mainText={getRandomHabitMessage()}
              buttonText="Add Habit"
              colorScheme={colorScheme as 'light' | 'dark'}
              onPress={() => router.push('/(detail)/habitEntry')}
            />
          )}
          {habits.map(habit => {
            const completedToday = isCompletedToday(habit.completedAt, habit.frequency);

            return (
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
                      borderColor: completedToday ? '#059669' : colorScheme === 'light' ? '#d6d3d1' : '#525252',
                      backgroundColor: completedToday ? '#059669' : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {completedToday && <Ionicons name='checkmark' size={14} color='#ffffff' />}
                  </ThemedView>

                  <ThemedView style={{ backgroundColor: 'transparent' }}>
                    <ThemedText
                      style={{
                        fontSize: 14,
                        fontWeight: '500',
                        color: completedToday
                          ? '#9ca3af'
                          : colorScheme === 'light'
                            ? '#292524'
                            : '#fafaf9',
                        textDecorationLine: completedToday ? 'line-through' : 'none',
                      }}
                    >
                      {truncate(habit.title, 32)}
                    </ThemedText>
                    <ThemedText style={{ fontSize: 10, color: colorScheme === 'light' ? '#a8a29e' : '#a8a29e' }}>
                      {habit.currentStreak} day streak • {habit.frequency.type}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </TouchableOpacity>
            )
          })}
        </ThemedView>

        {/* Quick Journal */}
        <ActionCard
          topLabel="Reflection"
          topIcon="chatbubble-outline"
          mainText={getRandomJournalPrompt()}
          buttonText="Write Entry"
          colorScheme={colorScheme as 'light' | 'dark'}
          onPress={() => router.push('/(detail)/journalEntry')}
        />
      </ThemedView>

    </ParallaxScrollView>
  );
};

export default Today;
