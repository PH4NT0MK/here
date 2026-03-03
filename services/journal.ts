import { JournalEntry } from "@/types/journal";
import { addDoc, collection, deleteDoc, doc, DocumentData, getDocs, limit, orderBy, query, QueryDocumentSnapshot, startAfter, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const addJournalEntry = async (
  userId: string,
  entry: { tags: string[]; content: string; energy: number }
) => {
  const colRef = collection(db, "users", userId, "journalEntries");
  const now = Date.now();

  const docRef = await addDoc(colRef, {
    content: entry.content.trim(),
    tags: entry.tags,
    energy: entry.energy,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id: docRef.id,
    content: entry.content.trim(),
    tags: entry.tags,
    energy: entry.energy,
    createdAt: now,
    updatedAt: now,
  } as JournalEntry;
};

export const updateJournalEntry = async (
  userId: string,
  entryId: string,
  updates: { tags?: string[]; content?: string; energy?: number }
) => {
  const docRef = doc(db, "users", userId, "journalEntries", entryId);
  await updateDoc(docRef, { ...updates, updatedAt: Date.now() });
};

export const deleteJournalEntry = async (userId: string, entryId: string) => {
  const docRef = doc(db, "users", userId, "journalEntries", entryId);
  await deleteDoc(docRef);
};

export const fetchJournalEntries = async (
  userId: string,
  pageSize = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
) => {
  const colRef = collection(db, "users", userId, "journalEntries");

  const q = lastDoc
    ? query(colRef, orderBy("createdAt", "desc"), startAfter(lastDoc), limit(pageSize))
    : query(colRef, orderBy("createdAt", "desc"), limit(pageSize));

  const snapshot = await getDocs(q);

  const entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as JournalEntry[];
  const lastVisible = snapshot.docs[snapshot.docs.length - 1];

  return { entries, lastVisible };
};
