export type JournalEntry = {
  id: string;
  content: string;
  tags: string[];
  energy: number;
  createdAt: number;
  updatedAt: number;
  favouritedAt?: number;
};
