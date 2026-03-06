import { useAuth } from "@/context/authContext";
import { Redirect } from "expo-router";

export default function MainIndex() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/today" />;
  } else {
    return <Redirect href="/sign-in" />;
  }
};
