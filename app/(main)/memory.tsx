import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, Pressable, ScrollView, useColorScheme } from 'react-native';

const TimeCapsule = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const milestones = [
    { id: 'm1', label: '1 Week Ago', date: 'Jan 28, 2026', text: "Feeling a bit tired today. Need to catch up on sleep and reset for the week ahead.", mood: 'Tired' },
    { id: 'm2', label: '1 Month Ago', date: 'Jan 4, 2026', text: "Started the new year with a fresh perspective. I want to focus on mindfulness this year.", mood: 'Determined' },
    { id: 'm3', label: '1 Year Ago', date: 'Feb 4, 2025', text: "It's my first day using this app! Excited to see where this journey takes me.", mood: 'Excited' }
  ];

  const timelineEntries = [
    { id: 1, date: 'Feb 3, 2026', preview: 'Had a great brainstorming session at work.', mood: 'Productive' },
    { id: 2, date: 'Feb 1, 2026', preview: 'Quiet Sunday at home. Read a book for 3 hours.', mood: 'Calm' },
    { id: 3, date: 'Jan 30, 2026', preview: 'Met up with old friends from college.', mood: 'Happy' },
    { id: 4, date: 'Jan 28, 2026', preview: 'Feeling a bit tired today. Need to catch up on sleep...', mood: 'Tired' },
    { id: 5, date: 'Jan 25, 2026', preview: 'Tried a new recipe for dinner. It was delicious!', mood: 'Creative' },
    { id: 6, date: 'Jan 20, 2026', preview: 'Struggling a bit with motivation today.', mood: 'Anxious' },
    { id: 7, date: 'Jan 15, 2026', preview: 'First snow of the year! Everything looks so peaceful.', mood: 'Awed' },
    { id: 8, date: 'Jan 10, 2026', preview: 'Productive workout session.', mood: 'Energetic' },
    { id: 9, date: 'Jan 4, 2026', preview: 'Started the new year with a fresh perspective...', mood: 'Determined' }
  ];

  return (
    <ThemedView style={{ flex: 1, backgroundColor: colorScheme === 'light' ? '#fafaf9' : '#1f1f1f' }}>
      {/* Header */}
      <ThemedView style={{ paddingTop: 48, paddingHorizontal: 24, paddingBottom: 16, backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626', borderBottomWidth: 1, borderBottomColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46' }}>
        <ThemedText type="title">Time Capsule</ThemedText>
        <ThemedText style={{ fontSize: 12, color: colorScheme === 'light' ? '#78716c' : '#a1a1aa', marginTop: 2 }}>Rediscover your past thoughts</ThemedText>
      </ThemedView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Milestones Carousel */}
        {milestones.length > 0 && (
          <FlatList
            data={milestones}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 24, paddingVertical: 16, gap: 16 }}
            renderItem={({ item }) => (
              <Pressable onPress={() => navigation.navigate('JournalDetail' as never)} style={{ width: 280, backgroundColor: '#10b981', borderRadius: 24, padding: 16, justifyContent: 'space-between', height: 192 }}>
                <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, backgroundColor: 'transparent' }}>
                  <ThemedText style={{ fontSize: 12, fontWeight: '700', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 }}>{item.label}</ThemedText>
                  <ThemedText style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{item.date}</ThemedText>
                </ThemedView>
                <ThemedText style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', flexShrink: 1 }}>{`"`}{item.text}{`"`}</ThemedText>
                <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, backgroundColor: 'transparent' }}>
                  <ThemedText style={{ fontSize: 12, backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 999, color: colorScheme === 'light' ? '#fafafa' : '#292524' }}>{item.mood}</ThemedText>
                  <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'transparent' }}>
                    <ThemedText style={{ fontSize: 12, fontWeight: '600', color: '#ffffff' }}>Read Entry</ThemedText>
                    <Ionicons name="arrow-forward" size={14} color="#ffffff" />
                  </ThemedView>
                </ThemedView>
              </Pressable>
            )}
          />
        )}

        {/* Timeline Section */}
        <ThemedView style={{ paddingHorizontal: 24, marginTop: 16 }}>
          <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Ionicons name="calendar-outline" size={16} color={colorScheme === 'light' ? '#78716c' : '#a1a1aa'} />
            <ThemedText style={{ fontSize: 12, fontWeight: '700', color: colorScheme === 'light' ? '#78716c' : '#a1a1aa', textTransform: 'uppercase', letterSpacing: 1 }}>Your Journey</ThemedText>
          </ThemedView>

          <ThemedView style={{ paddingLeft: 12, position: 'relative' }}>
            {/* Full vertical line */}
            <ThemedView style={{ position: 'absolute', left: 6, top: 0, bottom: 0, width: 2, backgroundColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46' }} />

            {timelineEntries.map((entry) => (
              <Pressable key={entry.id} onPress={() => navigation.navigate('JournalDetail' as never)} style={{ marginBottom: 24, position: 'relative' }}>

                {/* Dot on top of line */}
                <ThemedView style={{ position: 'absolute', left: -14, top: 3, width: 18, height: 18, borderRadius: 9, backgroundColor: colorScheme === 'light' ? '#d4d4d8' : '#57534e', borderWidth: 2, borderColor: colorScheme === 'light' ? '#ffffff' : '#1f1f1f', zIndex: 10 }} />

                {/* Timeline Content */}
                <ThemedView style={{ marginLeft: 18, flex: 1 }}>
                  <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <ThemedText style={{ fontSize: 12, fontWeight: '700', color: colorScheme === 'light' ? '#292524' : '#fafafa' }}>{entry.date}</ThemedText>
                    <ThemedText style={{ fontSize: 10, fontWeight: '500', color: colorScheme === 'light' ? '#57534e' : '#10b981', backgroundColor: colorScheme === 'light' ? '#f5f5f4' : '#3f3f46', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 999 }}>{entry.mood}</ThemedText>
                  </ThemedView>
                  <ThemedView style={{ backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46' }}>
                    <ThemedText style={{ fontSize: 14, color: colorScheme === 'light' ? '#57534e' : '#d4d4d8' }}>{entry.preview}</ThemedText>
                  </ThemedView>
                </ThemedView>
              </Pressable>
            ))}
          </ThemedView>

          <ThemedText style={{ fontSize: 10, color: colorScheme === 'light' ? '#78716c' : '#a1a1aa', textAlign: 'center', paddingVertical: 12 }}>End of timeline</ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};

export default TimeCapsule;
