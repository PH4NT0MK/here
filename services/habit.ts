import { Habit, HabitFrequency, RawHabit } from "@/types/habit";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { calculateStreaks } from "./streak";

export const addHabit = async (
  userId: string,
  data: {
    title: string;
    description?: string;
    frequency: HabitFrequency;
  }
) => {
  const colRef = collection(db, "users", userId, "habits");

  const docRef = await addDoc(colRef, {
    title: data.title.trim(),
    description: data.description?.trim() || "",
    frequency: data.frequency,
    createdAt: Date.now(),
    completedAt: [],
    archived: false,
  });

  return docRef.id;
};

export const updateHabit = async (
  userId: string,
  habitId: string,
  updates: {
    title?: string;
    description?: string;
    frequency?: HabitFrequency;
    archived?: boolean;
  }
) => {
  const docRef = doc(db, "users", userId, "habits", habitId);

  await updateDoc(docRef, {
    ...updates,
  });
};

export const deleteHabit = async (userId: string, habitId: string) => {
  const docRef = doc(db, "users", userId, "habits", habitId);
  await deleteDoc(docRef);
};

export const fetchHabits = async (userId: string) => {
  const colRef = collection(db, "users", userId, "habits");
  const q = query(colRef, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as RawHabit[];
};

export const fetchHabitsWithStreaks = async (userId: string) => {
  const habits: RawHabit[] = await fetchHabits(userId);

  return habits.map(habit => {
    const { currentStreak, longestStreak } = calculateStreaks(habit.completedAt || [], habit.frequency);
    return {
      ...habit,
      currentStreak,
      longestStreak,
    } as Habit;
  });
};

// export const completeHabit = async (
//   userId: string,
//   habitId: string
// ) => {
//   const docRef = doc(db, "users", userId, "habits", habitId);
//   const snapshot = await getDoc(docRef);

//   if (!snapshot.exists()) return;

//   const habit = snapshot.data();

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const todayMs = today.getTime();

//   const alreadyCompletedToday = habit.completedAt?.some((ms: number) => {
//     const d = new Date(ms);
//     d.setHours(0, 0, 0, 0);
//     return d.getTime() === todayMs;
//   });

//   if (alreadyCompletedToday) return;

//   await updateDoc(docRef, {
//     completedAt: arrayUnion(Date.now()),
//   });
// };

export const toggleCompleteHabit = async (userId: string, habitId: string) => {
  const docRef = doc(db, "users", userId, "habits", habitId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return;

  const habit = snapshot.data();
  const completedAt: number[] = habit.completedAt || [];
  const now = new Date();

  const frequencyType = habit.frequency?.type;
  const targetDay = habit.frequency?.day; // for monthly habits
  const frequency: number[] = habit.frequency?.days || []; // for custom habits

  const isCompleted = (ms: number) => {
    const date = new Date(ms);

    switch (frequencyType) {
      case "daily":
        return date.toDateString() === now.toDateString();

      case "weekly": {
        const windowStart = new Date(now);
        windowStart.setDate(windowStart.getDate() - 7);
        return date >= windowStart && date <= now;
      }

      case "monthly": {
        if (!targetDay) return false;
        const targetDateThisMonth = new Date(now.getFullYear(), now.getMonth(), targetDay);
        const windowStart = new Date(targetDateThisMonth);
        windowStart.setDate(windowStart.getDate() - 30);
        return date >= windowStart && date <= targetDateThisMonth;
      }

      case "custom": {
        const daysOfWeek: number[] = frequency || [];
        if (!daysOfWeek.length) return false;

        const sortedDays = [...daysOfWeek].sort((a, b) => a - b);

        // Step 1 & 2: Create single-element arrays
        let windows: number[][] = sortedDays.map((d) => [d]);

        // Step 3: Expand each array backward to the day after previous window
        for (let i = 0; i < windows.length; i++) {
          const prevEnd = i === 0 ? (sortedDays[sortedDays.length - 1] + 7) % 7 : sortedDays[i - 1];
          let start = (prevEnd + 1) % 7;
          const window = [];

          let day = start;
          while (true) {
            window.push(day);
            if (day === sortedDays[i]) break;
            day = (day + 1) % 7;
          }

          windows[i] = window;
        }

        // Step 4: Determine today
        const todayDay = now.getDay();

        // Step 5: Find window today belongs to
        const currentWindow = windows.find((w) => w.includes(todayDay));
        if (!currentWindow) return false;

        // Step 6: Check if a completion exists for any day in this window
        return completedAt.some((ms) => {
          const d = new Date(ms);
          return currentWindow.includes(d.getDay());
        });
      }

      default:
        return false;
    }
  };

  const index = completedAt.findIndex(isCompleted);

  if (index >= 0) {
    completedAt.splice(index, 1);
  } else {
    completedAt.push(Date.now());
  }

  await updateDoc(docRef, { completedAt });
  return completedAt;
};
