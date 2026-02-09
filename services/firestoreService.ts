import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const createUserDocument = async (user: any) => {
  if (!user?.uid) throw new Error("Invalid user");

  await setDoc(doc(db, "users", user.uid), {
    displayName: user.displayName || "",
    email: user.email,
    createdAt: Date.now(),
    settings: {
      notificationsEnabled: true,
      dailyReminders: true,
      theme: "default"
    }
  });
};
