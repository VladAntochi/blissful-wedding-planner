import { FC } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  width?: ViewStyle["width"];
}

export const Card: FC<CardProps> = ({ children, width = "90%" }) => {
  return <View style={{ ...styles.card, width }}>{children}</View>;
};

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
