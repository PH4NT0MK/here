import React from "react";
import { ActivityIndicator, View, ViewStyle } from "react-native";

type SpinnerProps = {
  size?: number | "small" | "large";
  color?: string;
  style?: ViewStyle;
};

export const Spinner = ({ size = "large", color = "#10b981", style }: SpinnerProps) => {
  return (
    <View style={[{ flex: 1, justifyContent: "center", alignItems: "center" }, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};
