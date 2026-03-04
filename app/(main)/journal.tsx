import { Spinner } from '@/components/spinner';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { energyLevels } from '@/constants/energyLevels';
import { defaultTags } from '@/constants/tags';
import { debounce } from '@/services/debounce';
import { toggleFavourite } from '@/services/journal';
import { formatJournalDate, truncate } from '@/services/utils';
import { JournalEntry } from '@/types/journal';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, useColorScheme } from 'react-native';
import { useAuth } from '../context/authContext';
import { useJournal } from '../context/journalContext';

const Journal = () => {
  const { user } = useAuth();
  const { entries, fetchInitial, setEntries, fetchMore, lastVisible } = useJournal();

  const colorScheme = useColorScheme();
  const [journalEntries, setJournalEntries] = useState([] as JournalEntry[]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [openDropdown, setOpenDropdown] = useState<null | 'moods' | 'tags'>(null);

  const handlePress = (f: string) => {
    const key = f.toLowerCase() as typeof filter;
    if (key === 'moods' || key === 'tags') {
      setOpenDropdown(openDropdown === key ? null : key);
    } else {
      setFilter(key);
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    if (!user?.uid || entries.length > 0) {
      return;
    }

    const init = async () => {
      setLoading(true);
      await fetchInitial(user.uid);
      setLoading(false);
    };

    init();
  }, [user?.uid, entries.length, fetchInitial]);

  const debouncedFetchMore = useRef<() => void>(() => { });

  useEffect(() => {
    if (!user?.uid) return;

    debouncedFetchMore.current = debounce(() => {
      fetchMore(user.uid);
    }, 200);
  }, [user?.uid, fetchMore]);

  useEffect(() => {
    if (filter === 'favorites') {
      setJournalEntries(entries.filter(e => !!e.favouritedAt));
    } else if (filter.startsWith('mood-')) {
      setJournalEntries(entries.filter(e => energyLevels?.[e?.energy - 1]?.label.toLowerCase() === filter.slice(5)));
      setOpenDropdown(null);
    } else if (filter.startsWith('tag-')) {
      setJournalEntries(entries.filter(e => e.tags.some(tag => tag === filter.slice(4))));
      setOpenDropdown(null);
    } else {
      setJournalEntries(entries);
    }
  }, [filter, entries]);

  const handleToggleFavourite = async (entryId: string) => {
    if (!user?.uid) return;

    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;

    const isCurrentlyFavourited = !!entry.favouritedAt;

    setEntries(prev =>
      prev.map(e =>
        e.id === entryId
          ? {
            ...e,
            favouritedAt: isCurrentlyFavourited ? undefined : Date.now(),
          }
          : e
      )
    );

    try {
      await toggleFavourite(user.uid, entryId, isCurrentlyFavourited);
    } catch {
      setEntries(prev =>
        prev.map(e =>
          e.id === entryId
            ? {
              ...e,
              favouritedAt: entry.favouritedAt,
            }
            : e
        )
      );

      Alert.alert(
        "Something went wrong",
        "We couldn't update your favourite. Please try again."
      );
    }
  };

  if (loading) {
    return <Spinner />;
  }

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
        <ThemedView style={{ flexDirection: 'row', gap: 8, backgroundColor: 'transparent' }}>
          {['All', 'Favorites', 'Moods', 'Tags'].map(f => <ThemedView key={f} style={{ backgroundColor: 'transparent' }}>
            <Pressable
              onPress={() => handlePress(f.toLowerCase())}
              style={{
                position: 'relative', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999,
                backgroundColor: f.toLowerCase() === filter ? (colorScheme === 'light' ? '#292524' : '#fafafa') : colorScheme === 'light' ? '#e7e5e4' : '#3f3f46'
              }}
            >
              <ThemedText style={{ fontSize: 14, fontWeight: '500', color: f.toLowerCase() === filter ? (colorScheme === 'light' ? '#ffffff' : '#1f1f1f') : colorScheme === 'light' ? '#57534e' : '#d4d4d8' }}>
                {f}
              </ThemedText>
            </Pressable>

            {openDropdown === 'moods' && f.toLowerCase() === 'moods' && (
              <ThemedView style={{ position: 'absolute', top: 24, left: 0, width: 120, backgroundColor: colorScheme === 'light' ? '#fff' : '#2b2b2e', borderRadius: 12, padding: 8, zIndex: 999, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 }}>
                {energyLevels.map(m => (
                  <Pressable key={m.label} onPress={() => setFilter(`mood-${m.label.toLowerCase()}`)}>
                    <ThemedText style={{ fontSize: 14, paddingVertical: 4, color: colorScheme === 'light' ? '#1c1917' : '#fafafa' }}>{m.label}</ThemedText>
                  </Pressable>
                ))}
              </ThemedView>
            )}

            {openDropdown === 'tags' && f.toLowerCase() === 'tags' && (
              <ThemedView style={{ position: 'absolute', top: 24, left: 0, width: 120, backgroundColor: colorScheme === 'light' ? '#fff' : '#2b2b2e', borderRadius: 12, padding: 8, zIndex: 999, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 }}>
                {defaultTags.map(t => (
                  <Pressable key={t.text} onPress={() => setFilter(`tag-${t.text.toLowerCase()}`)}>
                    <ThemedText style={{ fontSize: 14, paddingVertical: 4, color: colorScheme === 'light' ? '#1c1917' : '#fafafa' }}>{t.text}</ThemedText>
                  </Pressable>
                ))}
              </ThemedView>
            )}
          </ThemedView>
          )}
        </ThemedView>
      </ThemedView>

      {/* Entries */}
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (!user?.uid) {
            return;
          }

          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 20;

          if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
          ) {
            debouncedFetchMore.current();
          }
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, gap: 16 }}
      >
        {journalEntries.map((entry) => (
          <ThemedView
            key={entry.id}
            style={{ backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626', borderRadius: 16, padding: 20, paddingTop: 12, borderWidth: 1, borderColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46' }}
          >
            <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, backgroundColor: 'transparent' }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexDirection: 'row', gap: 6, backgroundColor: 'transparent', paddingVertical: 4 }}
              >
                {entry?.tags && [energyLevels[entry.energy - 1].label, ...entry?.tags].map((tag, i) => (
                  <ThemedView
                    key={tag}
                    style={{ backgroundColor: i === 0 ? energyLevels[entry.energy - 1].bgColor : colorScheme === 'light' ? '#ecfdf5' : '#064e3b', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}
                  >
                    <ThemedText style={{ fontSize: 12, fontWeight: '600', color: i === 0 ? energyLevels[entry.energy - 1].textColor : '#10b981' }}>{tag}</ThemedText>
                  </ThemedView>
                ))}
              </ScrollView>

              <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'transparent', marginLeft: 6 }}>
                <Ionicons name="calendar-outline" size={12} color={colorScheme === 'light' ? '#78716c' : '#a1a1aa'} />
                <ThemedText style={{ fontSize: 12, color: colorScheme === 'light' ? '#78716c' : '#a1a1aa' }}>{formatJournalDate(entry.createdAt, true)}</ThemedText>
              </ThemedView>
            </ThemedView>

            <Pressable
              onPress={() => router.push({
                pathname: "/(detail)/journalEntry",
                params: { id: entry.id }
              })}
            >
              <ThemedText numberOfLines={1} style={{ fontSize: 15, fontWeight: '600', marginBottom: 4 }}>
                {truncate(entry.content, 24)}
              </ThemedText>

              <ThemedView style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
                <ThemedText numberOfLines={4} style={{ flex: 1, fontSize: 14, lineHeight: 20, marginRight: 8, color: colorScheme === 'light' ? '#78716c' : '#a1a1aa' }}>
                  {truncate(entry.content, 256)}
                </ThemedText>

                <Pressable onPress={() => handleToggleFavourite(entry.id)}>
                  <Ionicons
                    name={entry.favouritedAt ? 'heart' : 'heart-outline'}
                    size={18}
                    color={entry.favouritedAt ? '#ef4444' : colorScheme === 'light' ? '#a1a1aa' : '#71717a'}
                    style={{ marginTop: 'auto' }}
                  />
                </Pressable>
              </ThemedView>
            </Pressable>
          </ThemedView>
        ))}
        <ThemedText style={{ textAlign: 'center', fontSize: 12, color: colorScheme === 'light' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)', marginVertical: 8 }}>
          {lastVisible === null && 'End of Entries'}
        </ThemedText>
      </ScrollView>

      {/* Floating Action Button */}
      <Pressable
        onPress={() => router.push({
          pathname: "/(detail)/journalEntry",
          params: {
            isCreatingP: "true"
          }
        })}
        style={{ position: 'absolute', right: 24, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: colorScheme === 'light' ? '#292524' : '#fafafa', alignItems: 'center', justifyContent: 'center', elevation: 6 }}
      >
        <Ionicons name="add" size={26} color={colorScheme === 'light' ? '#ffffff' : '#1f1f1f'} />
      </Pressable>
    </ThemedView>
  );
};

export default Journal;
