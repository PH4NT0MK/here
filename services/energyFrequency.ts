import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebaseConfig";

export type EnergyFrequency = { value: number; count: number };

export const getEnergyFrequency = async (userId: string): Promise<EnergyFrequency[]> => {
  const colRef = collection(db, "users", userId, "energyFrequency");

  const q = query(colRef, orderBy("value", "asc"));
  const snap = await getDocs(q);

  const frequencies: EnergyFrequency[] = [];
  snap.forEach(doc => {
    const data = doc.data();
    frequencies.push({ value: data.value, count: data.count });
  });

  const allValues: EnergyFrequency[] = [];
  for (let i = 1; i <= 5; i++) {
    const existing = frequencies.find(f => f.value === i);
    allValues.push({ value: i, count: existing?.count || 0 });
  }

  allValues.sort((a, b) => b.count - a.count);

  return allValues;
};
