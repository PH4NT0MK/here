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

        // consecutive if currDate is in the same month as prevDate => still part of streak
        // or currDate is in the next month => increment streak
        const isSameMonth = currYear === prevYear && currMonth === prevMonth;
        const isNextMonth =
          (currYear === prevYear && currMonth === prevMonth + 1) ||
          (currYear === prevYear + 1 && prevMonth === 11 && currMonth === 0);

        return isSameMonth || isNextMonth;
      case "custom":
        // For custom, we check if the day matches a scheduled day
        const prevDay = new Date(prev).getDay();
        const currDay = new Date(curr).getDay();
        // consecutive if currDay follows a scheduled day after prevDay
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

    case "custom":
      const todayDay = today.getDay();
      const completed = completedAt.some(ms => {
        const d = new Date(ms);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === todayMs;
      });
      if (completed) return true;

      // Sort the custom days [Mon=1, Wed=3, Fri=5] etc.
      const sortedDays = [...frequency.days].sort((a, b) => a - b);

      // Find the next scheduled day after today (or wrap around)
      const nextIndex = sortedDays.findIndex(day => day >= todayDay);
      const nextScheduledDay = nextIndex >= 0 ? sortedDays[nextIndex] : sortedDays[0];

      // If today is before or equal to the next scheduled day, consider it completed “naturally”
      return todayDay <= nextScheduledDay;

    default:
      return false;
  }
};
