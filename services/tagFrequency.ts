import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "./firebaseConfig";

export type TagFrequency = { tag: string; count: number; };

export const getTagFrequency = async (userId: string) => {
  const colRef = collection(db, "users", userId, "tagFrequency");

  const q = query(colRef, orderBy("count", "desc"), limit(6));
  const snap = await getDocs(q);

  const tags: TagFrequency[] = [];
  snap.forEach(doc => {
    const data = doc.data();
    tags.push({ tag: data.tag, count: data.count });
  });

  return tags;
};
