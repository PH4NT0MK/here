import { HabitFrequency } from "@/types/habit";
import { StreakResult } from "@/types/streak";

export const calculateStreaks = (
  timestamps: number[],
  frequency: HabitFrequency = { type: "daily" }
): StreakResult => {
  if (!timestamps || timestamps.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Normalize: sort ascending
  const dates = [...timestamps]
    .map(ms => {
      const d = new Date(ms);
      d.setHours(0, 0, 0, 0); // normalize to start of day
      return d.getTime();
    })
    .sort((a, b) => a - b);

  let currentStreak = 0;
  let longestStreak = 0;
  let streak = 1; // at least one day counts as a streak

  const isConsecutive = (prev: number, curr: number) => {
    const prevDate = new Date(prev);
    const currDate = new Date(curr);

    switch (frequency.type) {
      case "daily":
        return currDate.getTime() - prevDate.getTime() === 24 * 60 * 60 * 1000;
      case "weekly":
        // Check if current date is exactly 1 week after previous
        return currDate.getTime() - prevDate.getTime() === 7 * 24 * 60 * 60 * 1000;
      case "monthly":
        const prevMonth = prevDate.getMonth();
        const currMonth = currDate.getMonth();
        const prevYear = prevDate.getFullYear();
        const currYear = currDate.getFullYear();

        const isSameMonth = currYear === prevYear && currMonth === prevMonth;
        const isNextMonth =
          (currYear === prevYear && currMonth === prevMonth + 1) ||
          (currYear === prevYear + 1 && prevMonth === 11 && currMonth === 0);

        return isSameMonth || isNextMonth;
      case "custom":
        const prevDay = new Date(prev).getDay();
        const currDay = new Date(curr).getDay();
        const sortedDays = [...frequency.days].sort((a, b) => a - b);
        const prevIndex = sortedDays.indexOf(prevDay);
        const nextIndex = (prevIndex + 1) % sortedDays.length;
        return currDay === sortedDays[nextIndex];
      default:
        return false;
    }
  };

  for (let i = 1; i < dates.length; i++) {
    if (isConsecutive(dates[i - 1], dates[i])) {
      streak++;
    } else {
      streak = 1; // reset streak
    }
    longestStreak = Math.max(longestStreak, streak);
  }

  // Calculate current streak (from last date backwards)
  streak = 1;
  for (let i = dates.length - 1; i > 0; i--) {
    if (isConsecutive(dates[i - 1], dates[i])) {
      streak++;
    } else {
      break;
    }
  }

  currentStreak = streak;

  return { currentStreak, longestStreak };
};

export const isCompletedToday = (
  completedAt: number[],
  frequency: HabitFrequency
): boolean => {
  if (!completedAt || completedAt.length === 0) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();

  switch (frequency.type) {
    case "daily":
      return completedAt.some(ms => {
        const d = new Date(ms);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === todayMs;
      });

    case "weekly":
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay()); // Sunday
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      return completedAt.some(ms => {
        const d = new Date(ms);
        return d.getTime() >= weekStart.getTime() && d.getTime() <= weekEnd.getTime();
      });

    case "monthly":
      return completedAt.some(ms => {
        const d = new Date(ms);
        return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth();
      });

    case "custom": {
      const todayDay = today.getDay();

      // Sort scheduled days ascending
      const sortedDays = [...frequency.days].sort((a, b) => a - b);

      // Step 1: Build the windows for each scheduled day
      const windows: number[][] = sortedDays.map((d, i) => {
        const prev = i === 0 ? sortedDays[sortedDays.length - 1] : sortedDays[i - 1];
        const window: number[] = [];
        let day = (prev + 1) % 7;
        while (true) {
          window.push(day);
          if (day === sortedDays[i]) break;
          day = (day + 1) % 7;
        }
        return window;
      });

      // Step 2: Find the window today belongs to
      const currentWindow = windows.find((w) => w.includes(todayDay));
      if (!currentWindow) return false;

      // Step 3: Check if any completedAt timestamp is inside the current window
      const todayCompleted = completedAt.some((ms) => {
        const d = new Date(ms);
        const dayNum = d.getDay();
        return currentWindow.includes(dayNum);
      });

      return todayCompleted;
    }

    default:
      return false;
  }
};
