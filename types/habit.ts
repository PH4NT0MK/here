export type HabitFrequency =
  | { type: "daily" }
  | { type: "weekly"; day: number } // 0–6 (Sun–Sat)
  | { type: "monthly"; day: number } // 1–31
  | { type: "custom"; days: number[] }; // [1,3,5] (Mon, Wed, Fri)

export type Habit = {
  id: string;
  title: string;
  description?: string;
  frequency: HabitFrequency;
  createdAt: number;
  completedAt: number[];
  archived?: boolean;
};