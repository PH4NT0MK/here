import StatCard from "@/components/StatCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { habitPlaceholders } from "@/constants/habitPlaceholders";
import { addHabit, toggleCompleteToday, updateHabit } from "@/services/habit";
import { calculateStreaks } from "@/services/streak";
import { Habit, HabitFrequency } from "@/types/habit";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, TextInput, useColorScheme, } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { useAuth } from "../../context/authContext";
import { useHabits } from "../../context/habitContext";

const HabitScreen = () => {
  const { user } = useAuth();
  const { habits, setHabits, refreshHabits } = useHabits();

  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const isDark = colorScheme === "dark";

  const { id = null } = useLocalSearchParams();

  const [habit, setHabit] = useState<Habit | null>(null);
  const [completedToday, setCompletedToday] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [frequency, setFrequency] = useState<HabitFrequency>({
    type: "daily",
  });

  const [placeholder, setPlaceholder] = useState({ title: '', description: '' });

  useEffect(() => {
    const getRandomHabitPlaceholder = () => {
      const index = Math.floor(Math.random() * habitPlaceholders.length);
      return habitPlaceholders[index];
    };

    setPlaceholder(getRandomHabitPlaceholder());
  }, []);

  const frequencyTypes: HabitFrequency["type"][] = [
    "daily",
    "weekly",
    "monthly",
    "custom",
  ];

  const WEEKDAYS = [
    { short: "Sun", full: "Sunday" },
    { short: "Mon", full: "Monday" },
    { short: "Tue", full: "Tuesday" },
    { short: "Wed", full: "Wednesday" },
    { short: "Thu", full: "Thursday" },
    { short: "Fri", full: "Friday" },
    { short: "Sat", full: "Saturday" },
  ];

  useEffect(() => {
    if (!id) {
      setIsCreating(true);
    } else {
      const habit = habits.find(el => el.id === id);

      if (!habit) {
        return;
      }

      setHabit(habit);
      setCompletedToday(habit.completedAt?.some(ms => {
        const d = new Date(ms);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === new Date().setHours(0, 0, 0, 0);
      }));
      setTitle(habit.title);
      setDescription(habit.description ?? "");
      setFrequency(habit.frequency);
    }
  }, [id, habits]);

  const handleSave = async () => {
    if (!user?.uid) {
      return;
    }

    if (title.trim().length < 1) {
      Alert.alert(
        "Habit title cannot be empty."
      );
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      frequency,
    };

    if (isCreating) {
      await addHabit(user.uid, payload);
      await refreshHabits(user.uid);
    } else if (habit) {
      await updateHabit(user.uid, habit.id, payload);
      await refreshHabits(user.uid);
    }

    setIsEditing(false);
    navigation.goBack();
  };

  const getLast7DaysChartData = (completedAt: number[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const data = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);

      const isCompleted = completedAt?.some(ms => {
        const d = new Date(ms);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === day.getTime();
      });

      data.push({
        value: isCompleted ? 1 : 0,
        label: day.toLocaleDateString("en-US", { weekday: "short" }),
      });
    }

    return data;
  };

  const isViewMode = habit && !isEditing;

  return (
    <ThemedView style={{ flex: 1, backgroundColor: isDark ? "#1f1f1f" : "#fafaf9" }}>

      {/* Header */}
      <ThemedView
        style={{
          flexDirection: isEditing || isCreating ? "row-reverse" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? "#27272a" : "#e7e5e4",
        }}
      >
        {(isEditing || isCreating) && (
          <Pressable
            onPress={handleSave}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: isDark ? "#e7e5e4" : "#1c1917",
            }}
          >
            <ThemedText style={{ fontWeight: "600", color: isDark ? "#1c1917" : "#ffffff" }}>
              Save
            </ThemedText>
          </Pressable>
        )}

        {isViewMode && (
          <Pressable onPress={() => setIsEditing(true)} style={{ padding: 6 }}>
            <Ionicons name="pencil" size={22} color={isDark ? "#a1a1aa" : "#44403c"} />
          </Pressable>
        )}

        <ThemedText style={{ fontSize: 18, fontWeight: "700" }}>
          {isCreating ? "New Habit" : title}
        </ThemedText>

        <Pressable onPress={() => navigation.goBack()} style={{ padding: 6 }}>
          <Ionicons name="close" size={22} color={isDark ? "#a1a1aa" : "#44403c"} />
        </Pressable>
      </ThemedView>

      <ScrollView contentContainerStyle={{ padding: 24 }}>

        {/* Title */}
        {isEditing || isCreating ? <>
          <ThemedText style={{ fontWeight: 'bold' }}>
            HABIT TITLE
          </ThemedText>

          <ThemedView style={{ marginBottom: 32, paddingHorizontal: 4, borderRadius: 16, borderWidth: 1, borderColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46', backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626' }}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder={placeholder.title}
              placeholderTextColor={isDark ? "#525252" : "#a8a29e"}
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: isDark ? "#fafafa" : "#292524",
              }}
            />
          </ThemedView>
        </> : <>
          <ThemedText style={{ fontSize: 24, fontWeight: "700", marginBottom: 12 }}>
            {title}
          </ThemedText>
        </>}

        {/* Description */}
        {isEditing || isCreating ? <>
          <ThemedText style={{ fontWeight: 'bold' }}>
            DESCRIPTION (OPTIONAL)
          </ThemedText>

          <ThemedView style={{ marginBottom: 32, paddingHorizontal: 4, borderRadius: 16, borderWidth: 1, borderColor: colorScheme === 'light' ? '#e7e5e4' : '#3f3f46', backgroundColor: colorScheme === 'light' ? '#ffffff' : '#262626' }}>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder={placeholder.description}
              placeholderTextColor={isDark ? "#525252" : "#a8a29e"}
              multiline
              style={{
                fontSize: 14,
                marginBottom: 24,
                color: isDark ? "#a1a1aa" : "#78716c",
              }}
            />
          </ThemedView>
        </> : <>
          <ThemedText style={{ fontSize: 14, marginBottom: 24, color: isDark ? "#a1a1aa" : "#78716c" }}>
            {description}
          </ThemedText>
        </>}

        {/* Frequency */}
        {isEditing || isCreating ? <>
          <ThemedView style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, backgroundColor: 'transparent' }}>
            {frequencyTypes.map((type) => (
              <Pressable
                key={type}
                onPress={() => {
                  if (type === "daily") {
                    setFrequency({ type: "daily" });
                  }

                  if (type === "weekly") {
                    setFrequency({ type: "weekly", day: 1 });
                  }

                  if (type === "monthly") {
                    setFrequency({ type: "monthly", day: 1 });
                  }

                  if (type === "custom") {
                    setFrequency({ type: "custom", days: [] });
                  }
                }}
                style={{
                  flexBasis: '48%', // roughly half of the row minus gap
                  padding: 14,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: frequency.type === type ? "#10b981" : "#ddd",
                  alignItems: "center", // center text horizontally
                }}
              >
                <ThemedText style={{ textTransform: "capitalize" }}>
                  {type}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>

          {frequency.type === "weekly" && (
            <ThemedView
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center", // center buttons in each row
                gap: 16, // spacing between buttons
                marginTop: 16,
                backgroundColor: "transparent",
              }}
            >
              {WEEKDAYS.map((day, i) => (
                <Pressable
                  key={day.short}
                  onPress={() => setFrequency({ type: "weekly", day: i })}
                  style={{
                    flexBasis: "28%", // 3–4 per row depending on screen width
                    paddingVertical: 14, // bigger, easier to tap
                    borderRadius: 16,
                    backgroundColor: frequency.day === i ? "#10b981" : "#eee",
                    alignItems: "center",
                  }}
                >
                  <ThemedText
                    style={{
                      color: frequency.day === i ? "#fff" : "#000",
                      fontWeight: "600",
                    }}
                  >
                    {day.short}
                  </ThemedText>
                </Pressable>
              ))}
            </ThemedView>
          )}

          {frequency.type === "monthly" && (
            <ThemedView style={{ marginTop: 16, alignItems: "center", backgroundColor: 'transparent' }}>
              <TextInput
                keyboardType="number-pad"
                value={frequency.day.toString()}
                onChangeText={(t) => {
                  const day = Math.max(1, Math.min(31, parseInt(t) || 1));
                  setFrequency({ type: "monthly", day });
                }}
                style={{
                  width: 80,
                  padding: 12,
                  borderRadius: 12,
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "700",
                  backgroundColor: "#eee",
                }}
              />
            </ThemedView>
          )}

          {frequency.type === "custom" && (
            <ThemedView
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center", // center items in each row
                gap: 16, // spacing between buttons
                marginTop: 16,
                backgroundColor: "transparent",
              }}
            >
              {WEEKDAYS.map((day, i) => {
                const selected = frequency.days.includes(i);

                return (
                  <Pressable
                    key={day.short}
                    onPress={() => {
                      const newDays = selected
                        ? frequency.days.filter((d) => d !== i)
                        : [...frequency.days, i];

                      setFrequency({
                        type: "custom",
                        days: newDays,
                      });
                    }}
                    style={{
                      flexBasis: "28%", // adjust this for 3-4 per row; 28% with gap gives a nice fit
                      paddingVertical: 14, // bigger button
                      borderRadius: 16,
                      backgroundColor: selected ? "#10b981" : "#eee",
                      alignItems: "center",
                    }}
                  >
                    <ThemedText style={{ color: selected ? "#fff" : "#000", fontWeight: "600" }}>
                      {day.short}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </ThemedView>
          )}
        </> : <></>}

        {/* Only show analytics in VIEW mode */}
        {isViewMode && (
          <>
            {/* Chart */}
            <ThemedView
              style={{
                backgroundColor: isDark ? "#262626" : "#ffffff",
                padding: 24,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: isDark ? "#3f3f46" : "#e7e5e4",
                marginBottom: 24,
              }}
            >
              <ThemedText style={{ fontWeight: "700", marginBottom: 16 }}>
                History
              </ThemedText>

              <BarChart
                data={getLast7DaysChartData(habit.completedAt).map(item => ({
                  ...item,
                  frontColor:
                    item.value > 0
                      ? "#10b981"
                      : isDark
                        ? "#3f3f46"
                        : "#e5e5e5",
                }))}
                barWidth={20}
                barBorderRadius={4}
                spacing={16}
                height={160}
                hideRules
                yAxisThickness={0}
                xAxisThickness={0}
                hideYAxisText
              />
            </ThemedView>

            {/* Streak Cards */}
            <ThemedView style={{ flexDirection: "row", gap: 16, backgroundColor: 'transparent' }}>
              <StatCard label="Current Streak" value={habit?.currentStreak ?? 0} />
              <StatCard label={`Best Streak${habit?.longestStreak < habit?.currentStreak && ' (current)'}`} value={habit?.longestStreak ? 0 : habit?.longestStreak < habit?.currentStreak ? habit.currentStreak : habit.longestStreak} />
            </ThemedView>

            {/* Complete button */}
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

                setHabit(prev => prev ? { ...prev, completedAt: updatedCompletedAt, currentStreak, longestStreak } : prev);
                setHabits(prev => prev.map(h => h.id === habit.id ? { ...h, completedAt: updatedCompletedAt, currentStreak, longestStreak } : h));
                setCompletedToday(prev => !prev);
              }}
              style={{
                padding: 16,
                borderRadius: 16,
                backgroundColor: completedToday ? "#10b981" : isDark ? "#3f3f46" : "#e5e5e4",
                alignItems: "center",
                marginTop: 24,
              }}
            >
              <ThemedText style={{ color: completedToday ? "#fff" : isDark ? "#fafafa" : "#292524", fontWeight: "600" }}>
                {completedToday ? "Uncomplete Today" : "Complete Today"}
              </ThemedText>
            </Pressable>
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
};

export default HabitScreen;
