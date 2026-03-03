import { Spinner } from '@/components/spinner';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { formatJournalDate } from '@/services/utils';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, useColorScheme } from 'react-native';
import { useAuth } from '../context/authContext';
import { useJournal } from '../context/journalContext';

const TimeCapsule = () => {
  const { user } = useAuth();
  const { entries, fetchInitial } = useJournal();

  const [loading, setLoading] = useState(true);

  const colorScheme = useColorScheme();

  const milestones = [
    { id: 'm1', label: '1 Week Ago', date: 'Jan 28, 2026', text: "Feeling a bit tired today. Need to catch up on sleep and reset for the week ahead.", mood: 'Tired' },
    { id: 'm2', label: '1 Month Ago', date: 'Jan 4, 2026', text: "Started the new year with a fresh perspective. I want to focus on mindfulness this year.", mood: 'Determined' },
    { id: 'm3', label: '1 Year Ago', date: 'Feb 4, 2025', text: "It's my first day using this app! Excited to see where this journey takes me.", mood: 'Excited' }
  ];

  useEffect(() => {
    if (!user?.uid) return;

    const init = async () => {
      if (!entries || entries.length === 0) {
        await fetchInitial(user.uid);
      }

      setLoading(false);
    };

    init();
  }, [user, entries, fetchInitial]);

  if (loading) {
    return <Spinner />;
  }

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
              <Pressable onPress={() => router.push({
                pathname: "/(detail)/journalEntry",
                params: { id: item.id }
              })} style={{ width: 280, backgroundColor: '#10b981', borderRadius: 24, padding: 16, justifyContent: 'space-between', height: 192 }}>
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
        <ThemedView style={{ paddingHorizontal: 24, marginTop: 16, backgroundColor: 'transparent' }}>
          <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, backgroundColor: 'transparent' }}>
            <Ionicons name="calendar-outline" size={16} color={colorScheme === 'light' ? '#78716c' : '#a1a1aa'} />
            <ThemedText style={{ fontSize: 12, fontWeight: '700', color: colorScheme === 'light' ? '#78716c' : '#a1a1aa', textTransform: 'uppercase', letterSpacing: 1 }}>Your Journey</ThemedText>
          </ThemedView>

          <ThemedView style={{ paddingLeft: 12, position: 'relative', backgroundColor: 'transparent' }}>
            {/* Full vertical line */}
            <ThemedView style={{ position: 'absolute', left: 6, top: 0, bottom: 0, width: 2, backgroundColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46' }} />

            {entries.map((entry) => (
              <Pressable
                key={entry.id}
                onPress={() => router.push({
                  pathname: "/(detail)/journalEntry",
                  params: { id: entry.id }
                })}
                style={{ marginBottom: 24, position: 'relative' }}
              >

                {/* Dot on top of line */}
                <ThemedView style={{ position: 'absolute', left: -14, top: 3, width: 18, height: 18, borderRadius: 9, backgroundColor: colorScheme === 'light' ? '#d4d4d8' : '#57534e', borderWidth: 2, borderColor: colorScheme === 'light' ? '#ffffff' : '#1f1f1f', zIndex: 10 }} />

                {/* Timeline Content */}
                <ThemedView style={{ marginLeft: 18, flex: 1, backgroundColor: 'transparent' }}>
                  <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, backgroundColor: 'transparent' }}>
                    <ThemedText style={{ fontSize: 12, fontWeight: '700', color: colorScheme === 'light' ? '#292524' : '#fafafa' }}>{formatJournalDate(entry.createdAt, true)}</ThemedText>
                    <ThemedText style={{ fontSize: 10, fontWeight: '500', color: colorScheme === 'light' ? '#57534e' : '#10b981', backgroundColor: 'transparent', paddingHorizontal: 4 }}>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ flexDirection: 'row', gap: 6, backgroundColor: 'transparent', paddingVertical: 4 }}
                      >
                        {entry.tags.map(tag => (
                          <ThemedView
                            key={tag}
                            style={{ backgroundColor: colorScheme === 'light' ? '#ecfdf5' : '#064e3b', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}
                          >
                            <ThemedText style={{ fontSize: 12, fontWeight: '600', color: '#10b981' }}>{tag}</ThemedText>
                          </ThemedView>
                        ))}
                      </ScrollView>
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={{ backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46' }}>
                    <ThemedText style={{ fontSize: 14, color: colorScheme === 'light' ? '#57534e' : '#d4d4d8' }}>{entry.content}</ThemedText>
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
