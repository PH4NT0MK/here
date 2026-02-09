import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, ScrollView, useColorScheme } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

const data = [
  { value: 1, label: 'Mon' },
  { value: 1, label: 'Tue' },
  { value: 0, label: 'Wed' },
  { value: 1, label: 'Thu' },
  { value: 1, label: 'Fri' },
  { value: 1, label: 'Sat' },
  { value: 0, label: 'Sun' },
];

const HabitDetailScreen = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const chartData = data.map((item) => ({
    value: item.value,
    label: item.label,
    frontColor: item.value !== undefined && item.value !== null
      ? item.value > 0
        ? '#10b981'
        : colorScheme === 'light'
          ? '#e5e5e5'
          : '#3f3f46'
      : '#e5e5e5', // fallback color
  }));


  return (
    <ThemedView style={{ flex: 1, backgroundColor: colorScheme === 'light' ? '#fafaf9' : '#1f1f1f', paddingTop: 18 }}>
      {/* Header */}
      <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, backgroundColor: colorScheme === 'light' ? '#fafaf9' : '#1f1f1f' }}>
        <Pressable onPress={() => navigation.goBack()} style={{ padding: 8, borderRadius: 20 }}>
          <Ionicons name="arrow-back" size={24} color={colorScheme === 'light' ? '#44403c' : '#fafafa'} />
        </Pressable>
        <ThemedView style={{ flexDirection: 'row', gap: 8, backgroundColor: 'transparent' }}>
          <Pressable style={{ padding: 8, borderRadius: 20 }}>
            <Ionicons name="create-outline" size={20} color={colorScheme === 'light' ? '#44403c' : '#fafafa'} />
          </Pressable>
        </ThemedView>
      </ThemedView>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}>
        {/* Header Info */}
        <ThemedView style={{ alignItems: 'center', marginBottom: 32, backgroundColor: 'transparent' }}>
          <ThemedView style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#d1fae5', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Ionicons name="trophy-outline" size={40} color="#10b981" />
          </ThemedView>
          <ThemedText style={{ fontSize: 24, fontWeight: '700', color: colorScheme === 'light' ? '#292524' : '#fafafa', marginBottom: 4 }}>Morning Meditation</ThemedText>
          <ThemedText style={{ fontSize: 14, color: colorScheme === 'light' ? '#78716c' : '#a1a1aa', textAlign: 'center', maxWidth: 250 }}>
            Take 10 minutes every morning to breathe and center yourself.
          </ThemedText>
        </ThemedView>

        {/* History Chart */}
        <ThemedView style={{ backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46', marginBottom: 24 }}>
          <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, backgroundColor: 'transparent' }}>
            <ThemedText style={{ fontSize: 16, fontWeight: '700', color: colorScheme === 'light' ? '#292524' : '#fafafa' }}>History</ThemedText>
            <ThemedText style={{ fontSize: 12, fontWeight: '600', color: '#10b981', backgroundColor: '#d1fae5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>Last 7 Days</ThemedText>
          </ThemedView>

          <BarChart
            data={chartData}
            barWidth={20}
            barBorderRadius={4}
            spacing={16}
            height={160}
            // initialSpacing={0}
            hideRules
            // hideAxesAndRules
            yAxisThickness={0}
            xAxisThickness={0}
            hideYAxisText
            xAxisLabelTextStyle={{color: colorScheme === 'light' ? '#3f3f46' : '#e5e5e5'}}
          />
        </ThemedView>

        {/* Stats */}
        <ThemedView style={{ flexDirection: 'row', gap: 16, marginBottom: 24, backgroundColor: 'transparent' }}>
          <ThemedView style={{ flex: 1, backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46', alignItems: 'center' }}>
            <ThemedText style={{ fontSize: 24, fontWeight: '700', color: colorScheme === 'light' ? '#292524' : '#fafafa', marginBottom: 4 }}>12</ThemedText>
            <ThemedText style={{ fontSize: 10, fontWeight: '500', textTransform: 'uppercase', color: colorScheme === 'light' ? '#78716c' : '#a1a1aa' }}>Current Streak</ThemedText>
          </ThemedView>
          <ThemedView style={{ flex: 1, backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46', alignItems: 'center' }}>
            <ThemedText style={{ fontSize: 24, fontWeight: '700', color: colorScheme === 'light' ? '#292524' : '#fafafa', marginBottom: 4 }}>45</ThemedText>
            <ThemedText style={{ fontSize: 10, fontWeight: '500', textTransform: 'uppercase', color: colorScheme === 'light' ? '#78716c' : '#a1a1aa' }}>Best Streak</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Action Buttons */}
        <Pressable style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, paddingVertical: 16, backgroundColor: '#10b981', borderRadius: 16, marginBottom: 12 }}>
          <Ionicons name="checkmark" size={20} color="#ffffff" />
          <ThemedText style={{ fontSize: 16, fontWeight: '700', color: '#ffffff' }}>Mark Completed Today</ThemedText>
        </Pressable>

        <Pressable style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: '#f87171' }}>
          <Ionicons name="trash-outline" size={16} color="#f87171" />
          <ThemedText style={{ fontSize: 14, fontWeight: '500', color: '#f87171' }}>Delete Habit</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
};

export default HabitDetailScreen;
