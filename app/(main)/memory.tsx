import ActionCard from '@/components/ActionCard';
import { Spinner } from '@/components/spinner';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { energyLevels } from '@/constants/energyLevels';
import { debounce } from '@/services/debounce';
import { EnergyFrequency, getEnergyFrequency } from '@/services/energyFrequency';
import { toggleFavourite } from '@/services/journal';
import { getTagFrequency, TagFrequency } from '@/services/tagFrequency';
import { formatJournalDate, truncate } from '@/services/utils';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, useColorScheme } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useAuth } from '../../context/authContext';
import { useJournal } from '../../context/journalContext';

const TimeCapsule = () => {
  const { user } = useAuth();
  const { entries, setEntries, fetchInitial, fetchMore, lastVisible } = useJournal();

  const [loading, setLoading] = useState(true);

  const colorScheme = useColorScheme();

  // const [milestones, setMilestones] = useState<JournalEntry[]>([]);
  // const [loadingMilestones, setLoadingMilestones] = useState(false);

  // useEffect(() => {
  //   const getMilestones = async () => {
  //     if (!user?.uid) return;
  //     setLoadingMilestones(true);
  //     try {
  //       const latest = await fetchLatestFavourites(user.uid);
  //       setMilestones(latest);
  //     } catch (err) {
  //       console.error("Failed to fetch milestones", err);
  //     }
  //     setLoadingMilestones(false);
  //   };

  //   getMilestones();
  // }, [user?.uid]);

  const debouncedFetchMore = useRef<() => void>(() => { });

  useEffect(() => {
    if (!user?.uid) return;

    debouncedFetchMore.current = debounce(() => {
      fetchMore(user.uid);
    }, 200);
  }, [user?.uid, fetchMore]);

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

  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!user?.uid || hasFetched) return;

    const init = async () => {
      if (!entries || entries.length === 0) {
        await fetchInitial(user.uid);
      }

      setHasFetched(true);
      setLoading(false);
    };

    init();
  }, [user, entries, fetchInitial, hasFetched]);

  const [tab, setTab] = useState('memories');

  const tabs = [
    { id: 'memories', label: 'Memories', icon: 'book-outline' },
    { id: 'energy', label: 'Energy', icon: 'battery-charging-outline' },
    { id: 'tags', label: 'Tags', icon: 'pricetag-outline' },
    // { id: 'streaks', label: 'Streaks', icon: 'flame-outline' },
    { id: 'favourites', label: 'Favourites', icon: 'heart-outline' }
  ];

  const levels = ['', 'Exhausted', 'Tired', 'Neutral', 'Active', 'Energetic'];

  const [energyData, setEnergyData] = useState<EnergyFrequency[]>([]);
  const [tagData, setTagData] = useState<TagFrequency[]>([]);
  const [maxValue, setMaxValue] = useState(5);
  const [loadingChart, setLoadingChart] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchEnergyData = async () => {
      setLoadingChart(true);

      if (tab === 'energy') {
        const energy = await getEnergyFrequency(user.uid);
        setEnergyData(energy);
        setMaxValue(energy.length ? Math.max(...energy.map(t => t.count)) : 0);
      }

      if (tab === 'tags') {
        const tags = await getTagFrequency(user.uid);
        setTagData(tags);
        setMaxValue(tags.length ? Math.max(...tags.map(t => t.count)) : 0);
      }

      setLoadingChart(false);
    };

    fetchEnergyData();
  }, [tab, entries, user?.uid]);

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

      {/* Tabs */}
      <ThemedView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flex: 0, backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626', borderBottomWidth: 1, borderBottomColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46' }}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}
        >
          {tabs.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 32, paddingHorizontal: 14, borderRadius: 16, marginRight: 8, backgroundColor: tab === t.id ? '#10b981' : colorScheme === 'light' ? '#f3f4f6' : '#3f3f46' }}
            >
              <Ionicons name={t.icon as any} size={16} color={tab === t.id ? '#ffffff' : colorScheme === 'light' ? '#52525b' : '#d4d4d8'} />
              <ThemedText style={{ fontSize: 12, fontWeight: '600', marginLeft: 6, color: tab === t.id ? '#ffffff' : colorScheme === 'light' ? '#52525b' : '#d4d4d8' }}>
                {t.label}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </ThemedView>

      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (!user?.uid || tab !== 'memories') {
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
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {tab === 'memories' && <>
          {/* Milestones Carousel */}
          {/* {loadingMilestones ? <Spinner /> : milestones.length > 0 && (
            <FlatList
              data={milestones}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 24, paddingVertical: 16, gap: 16 }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/(detail)/journalEntry",
                      params: { id: item.id },
                    })
                  }
                  style={{
                    width: 280,
                    backgroundColor: colorScheme === "light" ? "#10b981" : "#064e3b",
                    borderRadius: 24,
                    padding: 16,
                    justifyContent: "space-between",
                    height: 192,
                  }}
                >
                  <ThemedView
                    style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8, backgroundColor: "transparent" }}
                  >
                    <ThemedText
                      style={{
                        fontSize: 12,
                        fontWeight: "700",
                        color: "#ffffff",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 8,
                      }}
                    >
                      {energyLevels[item.energy - 1].label}
                    </ThemedText>
                    <ThemedText style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
                      {formatJournalDate(item.createdAt, true)}
                    </ThemedText>
                  </ThemedView>

                  <ThemedText
                    style={{
                      fontSize: 14,
                      color: "#ffffff",
                      fontStyle: "italic",
                      flexShrink: 1,
                    }}
                  >
                    {truncate(item.content, 128)}
                  </ThemedText>

                  <ThemedView
                    style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8, backgroundColor: "transparent" }}
                  >
                    <ThemedText
                      style={{
                        fontSize: 12,
                        backgroundColor: "rgba(0,0,0,0.2)",
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        borderRadius: 999,
                        color: "#ffffff",
                      }}
                    >
                      {levels[item.energy]}
                    </ThemedText>
                    <ThemedView style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "transparent" }}>
                      <ThemedText style={{ fontSize: 12, fontWeight: "600", color: "#ffffff" }}>Read Entry</ThemedText>
                      <Ionicons name="arrow-forward" size={14} color="#ffffff" />
                    </ThemedView>
                  </ThemedView>
                </Pressable>
              )}
            />
          )} */}

          {/* Timeline Section */}
          <ThemedView style={{ paddingHorizontal: 24, marginTop: 16, backgroundColor: 'transparent' }}>
            {/* Header */}
            <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16, backgroundColor: 'transparent' }}>
              <Ionicons name="calendar-outline" size={20} color={colorScheme === 'light' ? '#10b981' : '#22c55e'} />
              <ThemedText style={{ fontWeight: '700', fontSize: 18, color: colorScheme === 'light' ? '#1c1917' : '#fafafa' }}>
                Your Journey
              </ThemedText>
            </ThemedView>

            <ThemedView style={{ paddingLeft: 12, position: 'relative', backgroundColor: 'transparent' }}>
              {/* Full vertical line */}
              <ThemedView style={{ position: 'absolute', left: 6, top: 0, bottom: 0, width: 2, backgroundColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46' }} />

              {entries.map((entry) => (
                <ThemedView
                  key={entry.id}
                  style={{ marginBottom: 24, position: 'relative', backgroundColor: 'transparent' }}
                >

                  {/* Dot on top of line */}
                  <ThemedView style={{ position: 'absolute', left: -14, top: 3, width: 18, height: 18, borderRadius: 9, backgroundColor: colorScheme === 'light' ? '#d4d4d8' : '#57534e', borderWidth: 2, borderColor: colorScheme === 'light' ? '#ffffff' : '#1f1f1f', zIndex: 10 }} />

                  {/* Timeline Content */}
                  <ThemedView style={{ marginLeft: 18, flex: 1, backgroundColor: 'transparent' }}>
                    <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, backgroundColor: 'transparent', flexWrap: 'nowrap' }}>
                      {/* Date */}
                      <ThemedText style={{ fontSize: 12, fontWeight: '700', color: colorScheme === 'light' ? '#292524' : '#fafafa' }}>
                        {formatJournalDate(entry.createdAt, true)}
                      </ThemedText>

                      {/* Tags */}
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ flexDirection: 'row', gap: 6, paddingVertical: 4 }}
                        style={{ maxWidth: '60%' }}
                        nestedScrollEnabled={true}
                      >
                        {entry?.tags &&
                          [energyLevels[entry.energy - 1].label, ...entry.tags].map((tag, i) => (
                            <ThemedView
                              key={tag}
                              style={{
                                backgroundColor: i === 0 ? energyLevels[entry.energy - 1].bgColor : colorScheme === 'light' ? '#ecfdf5' : '#064e3b',
                                paddingHorizontal: 8,
                                paddingVertical: 2,
                                borderRadius: 6,
                              }}
                            >
                              <ThemedText
                                style={{
                                  fontSize: 12,
                                  fontWeight: '600',
                                  color: i === 0 ? energyLevels[entry.energy - 1].textColor : '#10b981',
                                }}
                              >
                                {tag}
                              </ThemedText>
                            </ThemedView>
                          ))}
                      </ScrollView>
                    </ThemedView>
                    <Pressable
                      onPress={() => router.push({
                        pathname: "/(detail)/journalEntry",
                        params: { id: entry.id }
                      })}
                      style={{ backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46' }}
                    >
                      <ThemedText style={{ fontSize: 14, color: colorScheme === 'light' ? '#57534e' : '#d4d4d8' }}>{entry.content}</ThemedText>
                    </Pressable>
                  </ThemedView>
                </ThemedView>
              ))}
            </ThemedView>

            {lastVisible === null && entries?.length !== 0 ? <ThemedText style={{ fontSize: 10, color: colorScheme === 'light' ? '#78716c' : '#a1a1aa', textAlign: 'center', paddingVertical: 12 }}>
              End of timeline
            </ThemedText> : <ActionCard
              topLabel="Memory"
              topIcon="book-outline"
              mainText="The beginning of your journey, start today"
              buttonText="Add Memory"
              colorScheme={colorScheme as 'light' | 'dark'}
              onPress={() => router.replace('/(detail)/journalEntry')}
            />}
          </ThemedView>
        </>}

        {tab === 'energy' && (
          <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 }}>

            {/* Header */}
            <ThemedView style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: 'transparent' }}>
              <Ionicons name="flash" size={18} color="#10b981" />
              <ThemedText style={{ fontWeight: '700', fontSize: 18, marginLeft: 8, color: colorScheme === 'light' ? '#292524' : '#fafafa' }}>
                Energy Levels
              </ThemedText>
            </ThemedView>

            {entries.length === 0 ? (
              <ActionCard
                topLabel="Energy"
                topIcon="flash-outline"
                mainText="Track your energy by writing a new journal entry"
                buttonText="Add Entry"
                colorScheme={colorScheme as 'light' | 'dark'}
                onPress={() => router.replace('/(detail)/journalEntry')}
              />
            ) : <>
              {/* Chart Card */}
              <ThemedView style={{ backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626', marginBottom: 24, paddingVertical: 12, borderRadius: 24, borderWidth: 1, borderColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46', alignItems: 'center' }}>
                <ThemedView
                  style={{ alignSelf: 'center', backgroundColor: 'transparent' }}
                >
                  {loadingChart ? <Spinner /> : <BarChart
                    data={energyData.map(item => ({
                      value: item.count,
                      label: levels[item.value].slice(0, 4),
                      frontColor: item.count > 0 ? '#10b981' : colorScheme === 'light' ? '#e5e5e5' : '#3f3f46',
                    }))}
                    barWidth={20}
                    barBorderRadius={4}
                    maxValue={maxValue}
                    noOfSections={maxValue < 5 ? maxValue : 5}
                    spacing={16}
                    height={160}
                    hideRules
                    rulesColor={colorScheme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'}
                    yAxisThickness={0}
                    xAxisThickness={0}
                    yAxisTextStyle={{ color: colorScheme === 'light' ? '#78716c' : '#a1a1aa', fontSize: 12 }}
                    xAxisLabelTextStyle={{ color: colorScheme === 'light' ? '#78716c' : '#a1a1aa' }}
                  />}
                </ThemedView>
              </ThemedView>

              <ThemedView style={{ gap: 12, backgroundColor: 'transparent' }}>
                {energyData.map((item, i) => (
                  <ThemedView
                    key={item.value}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626',
                      padding: 16,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46',
                    }}
                  >
                    <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'transparent' }}>
                      <ThemedView
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: '#d1fae5',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ThemedText style={{ fontSize: 12, fontWeight: '700', color: '#065f46', backgroundColor: 'transparent' }}>
                          {/* {i + 1} */}
                          {item.value}
                        </ThemedText>
                      </ThemedView>
                      <ThemedText style={{ fontSize: 14, fontWeight: '500', color: colorScheme === 'light' ? '#1c1917' : '#fafafa', backgroundColor: 'transparent' }}>
                        {levels[item.value]}
                      </ThemedText>
                    </ThemedView>
                    <ThemedText style={{ fontSize: 12, fontWeight: '700', color: '#10b981' }}>
                      {item.count}×
                    </ThemedText>
                  </ThemedView>
                ))}
              </ThemedView>
            </>}

          </ScrollView>
        )}

        {tab === 'tags' && (
          <ScrollView contentContainerStyle={{ padding: 24 }}>
            <ThemedView style={{ marginBottom: 24, backgroundColor: 'transparent' }}>
              {/* Header */}
              <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16, backgroundColor: 'transparent' }}>
                <Ionicons name="pricetag-outline" size={20} color={colorScheme === 'light' ? '#10b981' : '#22c55e'} />
                <ThemedText style={{ fontWeight: '700', fontSize: 18, color: colorScheme === 'light' ? '#1c1917' : '#fafafa' }}>
                  Tag Frequency
                </ThemedText>
              </ThemedView>

              {entries.length === 0 ? (
                <ActionCard
                  topLabel="Tags"
                  topIcon="pricetag-outline"
                  mainText="Start tagging your thoughts and experiences today"
                  buttonText="Add Entry"
                  colorScheme={colorScheme as 'light' | 'dark'}
                  onPress={() => router.replace('/(detail)/journalEntry')}
                />
              ) : <>
                {/* Bar Chart */}
                <ThemedView
                  style={{
                    backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626',
                    padding: 16,
                    borderRadius: 24,
                    borderWidth: 1,
                    borderColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46',
                    marginBottom: 24,
                  }}
                >
                  <ThemedView
                    style={{ alignSelf: 'center', backgroundColor: 'transparent' }}
                  >
                    {loadingChart ? <Spinner /> : <BarChart
                      data={tagData.map(item => ({
                        value: item.count,
                        label: item.tag.slice(0, 4),
                        frontColor: item.count > 0 ? '#10b981' : colorScheme === 'light' ? '#e5e5e5' : '#3f3f46',
                      }))}
                      barWidth={20}
                      barBorderRadius={4}
                      maxValue={maxValue}
                      noOfSections={maxValue < 5 ? maxValue : 5}
                      spacing={16}
                      height={160}
                      hideRules
                      rulesColor={colorScheme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'}
                      yAxisThickness={0}
                      xAxisThickness={0}
                      yAxisTextStyle={{ color: colorScheme === 'light' ? '#78716c' : '#a1a1aa', fontSize: 12 }}
                      xAxisLabelTextStyle={{ color: colorScheme === 'light' ? '#78716c' : '#a1a1aa' }}
                    />}
                  </ThemedView>
                </ThemedView>

                {/* Tag List */}
                <ThemedView style={{ gap: 12, backgroundColor: 'transparent' }}>
                  {tagData.map((tag, index) => (
                    <ThemedView
                      key={tag.tag}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626',
                        padding: 16,
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46',
                      }}
                    >
                      <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'transparent' }}>
                        <ThemedView
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: '#d1fae5',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <ThemedText style={{ fontSize: 12, fontWeight: '700', color: '#065f46', backgroundColor: 'transparent' }}>{index + 1}</ThemedText>
                        </ThemedView>
                        <ThemedText style={{ fontSize: 14, fontWeight: '500', color: colorScheme === 'light' ? '#1c1917' : '#fafafa', backgroundColor: 'transparent' }}>
                          {tag.tag}
                        </ThemedText>
                      </ThemedView>
                      <ThemedText style={{ fontSize: 12, fontWeight: '700', color: '#10b981' }}>{tag.count}×</ThemedText>
                    </ThemedView>
                  ))}
                </ThemedView>
              </>}

            </ThemedView>
          </ScrollView>
        )}

        {tab === 'favourites' && (
          <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
            {/* Header */}
            <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16, backgroundColor: 'transparent' }}>
              <Ionicons name="heart-outline" size={20} color={colorScheme === 'light' ? '#10b981' : '#22c55e'} />
              <ThemedText style={{ fontWeight: '700', fontSize: 18, color: colorScheme === 'light' ? '#1c1917' : '#fafafa' }}>
                Favourites
              </ThemedText>
            </ThemedView>

            {entries.length === 0 ? (
              <ActionCard
                topLabel="Favourites"
                topIcon="star-outline"
                mainText="Your favourites will appear here—create an entry to get started"
                buttonText="Add Entry"
                colorScheme={colorScheme as 'light' | 'dark'}
                onPress={() => router.replace('/(detail)/journalEntry')}
              />
            ) : <>
              {entries.filter(e => e.favouritedAt).map(entry => (
                <ThemedView key={entry.id} style={{ backgroundColor: colorScheme === 'light' ? '#fff7f8' : '#3f1f23', borderRadius: 16, padding: 20, paddingTop: 12, borderWidth: 1, borderColor: colorScheme === 'light' ? '#fbcfe8' : '#5a1f2b' }}>
                  <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, backgroundColor: 'transparent' }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', gap: 6, backgroundColor: 'transparent', paddingVertical: 4 }}>
                      {[energyLevels[entry.energy - 1].label, ...(entry.tags || [])].map((tag, i) => (
                        <ThemedView key={tag} style={{ backgroundColor: i === 0 ? energyLevels[entry.energy - 1].bgColor : colorScheme === 'light' ? '#f0fdf4' : '#064e3b', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                          <ThemedText style={{ fontSize: 12, fontWeight: '600', color: i === 0 ? energyLevels[entry.energy - 1].textColor : '#10b981' }}>{tag}</ThemedText>
                        </ThemedView>
                      ))}
                    </ScrollView>
                    <ThemedView style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'transparent', marginLeft: 6 }}>
                      <Ionicons name="calendar-outline" size={12} color={colorScheme === 'light' ? '#78716c' : '#a1a1aa'} />
                      <ThemedText style={{ fontSize: 12, color: colorScheme === 'light' ? '#78716c' : '#a1a1aa' }}>{formatJournalDate(entry.createdAt, true)}</ThemedText>
                    </ThemedView>
                  </ThemedView>
                  <Pressable onPress={() => router.push({ pathname: '/(detail)/journalEntry', params: { id: entry.id } })}>
                    <ThemedText numberOfLines={1} style={{ fontSize: 15, fontWeight: '600', marginBottom: 4, color: colorScheme === 'light' ? '#27272a' : '#fafafa' }}>{truncate(entry.content, 24)}</ThemedText>
                    <ThemedView style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
                      <ThemedText numberOfLines={4} style={{ flex: 1, fontSize: 14, lineHeight: 20, marginRight: 8, color: colorScheme === 'light' ? '#52525b' : '#d4d4d8' }}>{truncate(entry.content, 256)}</ThemedText>
                      <Pressable onPress={() => handleToggleFavourite(entry.id)}>
                        <Ionicons name={entry.favouritedAt ? 'heart' : 'heart-outline'} size={18} color={entry.favouritedAt ? '#ef4444' : colorScheme === 'light' ? '#a1a1aa' : '#71717a'} style={{ marginTop: 'auto' }} />
                      </Pressable>
                    </ThemedView>
                  </Pressable>
                </ThemedView>
              ))}
            </>}
          </ScrollView>
        )}

      </ScrollView>
    </ThemedView>
  );
};

export default TimeCapsule;
