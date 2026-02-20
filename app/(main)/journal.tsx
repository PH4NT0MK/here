import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { fetchJournalEntries } from '@/services/journal';
import { formatJournalDate, truncate } from '@/services/utils';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, useColorScheme } from 'react-native';
import { useAuth } from '../context/authContext';

export type JournalEntry = {
  id?: string;
  content: string;
  tags: string[];
  energy: number;
  createdAt: number;
  updatedAt: number;
};

const Journal = () => {
  const { user } = useAuth();

  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [journalEntries, setJournalEntrues] = useState([{}] as JournalEntry[]);
  const [loading, setLoading] = useState(true);

  const handleJournalEntries = async () => {
    if (!user?.uid) {
      return;
    }
    const entries = await fetchJournalEntries(user.uid);
    console.log(entries);

    setJournalEntrues(entries.entries as JournalEntry[]);
    setLoading(false);
  }

  useEffect(() => {
    handleJournalEntries();
  }, [user]);

  return (
    <ThemedView style={{ flex: 1, backgroundColor: colorScheme === 'light' ? '#fafaf9' : '#1f1f1f' }}>
      {/* Header */}
      <ThemedView style={{ paddingTop: 48, paddingHorizontal: 24, paddingBottom: 16, backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626', borderBottomWidth: 1, borderBottomColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46' }}>
        <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, backgroundColor: 'transparent' }}>
          <ThemedText type="title">Journal</ThemedText>

          <Pressable style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="search" size={20} color={colorScheme === 'light' ? '#44403c' : '#e5e7eb'} />
          </Pressable>
        </ThemedView>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', gap: 8 }}>
          {['All', 'Favorites', 'Moods', 'Tags'].map((filter, index) => (
            <Pressable
              key={filter}
              style={{ paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999, backgroundColor: index === 0 ? (colorScheme === 'light' ? '#292524' : '#fafafa') : colorScheme === 'light' ? '#e7e5e4' : '#3f3f46' }}
            >
              <ThemedText
                style={{ fontSize: 14, fontWeight: '500', color: index === 0 ? (colorScheme === 'light' ? '#ffffff' : '#1f1f1f') : colorScheme === 'light' ? '#57534e' : '#d4d4d8' }}
              >
                {filter}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </ThemedView>

      {/* Entries */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, gap: 16 }}>
        {loading ? <></>
          : journalEntries.map((entry) => (
            <Pressable
              key={entry.id}
              onPress={() => navigation.navigate('JournalDetail' as never)}
              style={{ backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626', borderRadius: 16, padding: 20, paddingTop: 12, borderWidth: 1, borderColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46' }}
            >
              <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, backgroundColor: 'transparent' }}>
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

                <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'transparent' }}>
                  <Ionicons name="calendar-outline" size={12} color={colorScheme === 'light' ? '#78716c' : '#a1a1aa'} />
                  <ThemedText style={{ fontSize: 12, color: colorScheme === 'light' ? '#78716c' : '#a1a1aa' }}>{formatJournalDate(entry.createdAt, true)}</ThemedText>
                </ThemedView>
              </ThemedView>

              <ThemedText numberOfLines={1} style={{ fontSize: 15, fontWeight: '600', marginBottom: 4 }}>
                {truncate(entry.content, 24)}
              </ThemedText>

              <ThemedText numberOfLines={2} style={{ fontSize: 14, lineHeight: 20, color: colorScheme === 'light' ? '#78716c' : '#a1a1aa' }}>
                {truncate(entry.content, 56)}
              </ThemedText>
            </Pressable>
          ))}
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable
        onPress={() => router.push("/(detail)/newJournalEntry")}
        style={{ position: 'absolute', right: 24, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: colorScheme === 'light' ? '#292524' : '#fafafa', alignItems: 'center', justifyContent: 'center', elevation: 6 }}
      >
        <Ionicons name="add" size={26} color={colorScheme === 'light' ? '#ffffff' : '#1f1f1f'} />
      </Pressable>
    </ThemedView>
  );
};

export default Journal;
