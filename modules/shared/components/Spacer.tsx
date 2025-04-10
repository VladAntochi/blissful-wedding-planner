import { FC } from "react";
import { View, ViewStyle } from "react-native";

interface SpacerProps {
  size: ViewStyle["height"];
  orientation?: "row" | "column";
}
export const Spacer: FC<SpacerProps> = ({ size, orientation = "column" }) => {
  return (
    <View
      style={{
        height: orientation === "row" ? 0 : size,
        width: orientation === "row" ? size : 0,
      }}
    />
  );
};
