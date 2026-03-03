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

export const toggleCompleteToday = async (userId: string, habitId: string) => {
  const docRef = doc(db, "users", userId, "habits", habitId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return;

  const habit = snapshot.data();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();

  const completedAt: number[] = habit.completedAt || [];
  const index = completedAt.findIndex(ms => {
    const d = new Date(ms);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === todayMs;
  });

  if (index >= 0) {
    // Already completed today -> remove it
    completedAt.splice(index, 1);
  } else {
    // Not completed today -> add it
    completedAt.push(Date.now());
  }

  await updateDoc(docRef, { completedAt });
  return completedAt;
};
