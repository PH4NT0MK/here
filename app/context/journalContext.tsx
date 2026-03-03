import { fetchJournalEntries } from "@/services/journal";
import { JournalEntry } from "@/types/journal";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { createContext, ReactNode, useContext, useState } from "react";

type JournalContextType = {
  entries: JournalEntry[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
  loading: boolean;
  fetchInitial: (userId: string) => Promise<void>;
  fetchMore: (userId: string) => Promise<void>;
  reset: () => void;
};

const JournalContext = createContext<JournalContextType>({
  entries: [],
  lastVisible: null,
  loading: false,
  fetchInitial: async () => { },
  fetchMore: async () => { },
  reset: () => { },
});

export const JournalProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInitial = async (userId: string) => {
    if (loading) return;
    setLoading(true);

    const { entries, lastVisible } = await fetchJournalEntries(userId);

    setEntries(entries);
    setLastVisible(lastVisible ?? null);
    setLoading(false);
  };

  const fetchMore = async (userId: string) => {
    if (loading || !lastVisible) return;
    setLoading(true);

    const { entries: newEntries, lastVisible: newLast } =
      await fetchJournalEntries(userId, 10, lastVisible);

    setEntries(prev => [...prev, ...newEntries]);
    setLastVisible(newLast ?? null);
    setLoading(false);
  };

  const reset = () => {
    setEntries([]);
    setLastVisible(null);
  };

  return (
    <JournalContext.Provider
      value={{
        entries,
        lastVisible,
        loading,
        fetchInitial,
        fetchMore,
        reset,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => useContext(JournalContext);