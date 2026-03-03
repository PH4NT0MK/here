import { useColorScheme } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

const StatCard = ({ label, value }: { label: string; value: number }) => {
  const isDark = useColorScheme() === "dark";

  return (
    <ThemedView
      style={{
        flex: 1,
        backgroundColor: isDark ? "#262626" : "#ffffff",
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: isDark ? "#3f3f46" : "#e7e5e4",
        alignItems: "center",
      }}
    >
      <ThemedText style={{ fontSize: 24, fontWeight: "700", marginBottom: 4 }}>
        {value}
      </ThemedText>
      <ThemedText style={{ fontSize: 10, textTransform: "uppercase" }}>
        {label}
      </ThemedText>
    </ThemedView>
  );
};

export default StatCard;
