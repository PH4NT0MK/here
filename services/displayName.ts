import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export async function setDisplayName(name: string) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No user signed in");
  }

  const userRef = doc(db, "users", user.uid);

  await updateDoc(userRef, {
    displayName: name,
  });
};
