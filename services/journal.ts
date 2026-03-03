import { JournalEntry } from "@/types/journal";
import { addDoc, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, runTransaction, startAfter, updateDoc } from "firebase/firestore";
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

  // tagFrequency
  for (const tag of entry.tags) {
    const tagRef = doc(db, "users", userId, "tagFrequency", tag);
    await runTransaction(db, async (transaction) => {
      const tagSnap = await transaction.get(tagRef);
      if (tagSnap.exists()) {
        transaction.update(tagRef, { count: tagSnap.data().count + 1 });
      } else {
        transaction.set(tagRef, { tag, count: 1 });
      }
    });
  }

  // energyFrequency
  const energyRef = doc(db, "users", userId, "energyFrequency", String(entry.energy));
  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(energyRef);
    if (snap.exists()) {
      transaction.update(energyRef, { count: snap.data().count + 1 });
    } else {
      transaction.set(energyRef, { value: entry.energy, count: 1 });
    }
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
  const entryRef = doc(db, "users", userId, "journalEntries", entryId);
  const entrySnap = await getDoc(entryRef);

  if (!entrySnap.exists()) return;

  const oldEntry = entrySnap.data() as JournalEntry;
  const now = Date.now();

  await updateDoc(entryRef, { ...updates, updatedAt: now });

  // tagFrequency
  if (updates.tags) {
    const oldTags = oldEntry.tags || [];
    const newTags = updates.tags;

    const tagsToRemove = oldTags.filter(tag => !newTags.includes(tag));
    const tagsToAdd = newTags.filter(tag => !oldTags.includes(tag));

    for (const tag of tagsToRemove) {
      const tagRef = doc(db, "users", userId, "tagFrequency", tag);
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(tagRef);
        if (snap.exists()) {
          const newCount = Math.max((snap.data().count || 1) - 1, 0);
          transaction.update(tagRef, { count: newCount });
        }
      });
    }

    for (const tag of tagsToAdd) {
      const tagRef = doc(db, "users", userId, "tagFrequency", tag);
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(tagRef);
        if (snap.exists()) {
          transaction.update(tagRef, { count: snap.data().count + 1 });
        } else {
          transaction.set(tagRef, { tag, count: 1 });
        }
      });
    }
  }

  // energyFrequency
  if (updates.energy !== undefined) {
    const oldEnergyRef = doc(db, "users", userId, "energyFrequency", String(oldEntry.energy));
    const newEnergyRef = doc(db, "users", userId, "energyFrequency", String(updates.energy));

    await runTransaction(db, async (transaction) => {
      // Decrement old energy
      const oldSnap = await transaction.get(oldEnergyRef);
      if (oldSnap.exists()) {
        const newCount = Math.max((oldSnap.data().count || 1) - 1, 0);
        transaction.update(oldEnergyRef, { count: newCount });
      }

      // Increment new energy
      const newSnap = await transaction.get(newEnergyRef);
      if (newSnap.exists()) {
        transaction.update(newEnergyRef, { count: newSnap.data().count + 1 });
      } else {
        transaction.set(newEnergyRef, { value: updates.energy, count: 1 });
      }
    });
  }
};

export const deleteJournalEntry = async (userId: string, entryId: string) => {
  const entryRef = doc(db, "users", userId, "journalEntries", entryId);
  const entrySnap = await getDoc(entryRef);

  if (!entrySnap.exists()) return;

  const entry = entrySnap.data() as JournalEntry;

  await deleteDoc(entryRef);

  // tagFrequency
  for (const tag of entry.tags) {
    const tagRef = doc(db, "users", userId, "tagFrequency", tag);
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(tagRef);
      if (snap.exists()) {
        const newCount = Math.max((snap.data().count || 1) - 1, 0);
        transaction.update(tagRef, { count: newCount });
      }
    });
  }

  // energySummary
  const energyRef = doc(db, "users", userId, "energyFrequency", String(entry.energy));
  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(energyRef);
    if (snap.exists()) {
      const newCount = Math.max((snap.data().count || 1) - 1, 0);
      transaction.update(energyRef, { count: newCount });
    }
  });
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
