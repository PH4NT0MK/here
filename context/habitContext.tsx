import { fetchHabitsWithStreaks } from "@/services/habit";
import { Habit } from "@/types/habit";
import { createContext, ReactNode, useContext, useState } from "react";

type HabitsContextType = {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  refreshHabits: (userId: string) => Promise<void>;
};

const HabitsContext = createContext<HabitsContextType>({
  habits: [],
  setHabits: () => {},
  refreshHabits: async () => {},
});

export const HabitsProvider = ({ children }: { children: ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  const refreshHabits = async (userId: string) => {
    const fetched = await fetchHabitsWithStreaks(userId);
    setHabits(fetched);
  };

  return (
    <HabitsContext.Provider value={{ habits, setHabits, refreshHabits }}>
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => useContext(HabitsContext);
