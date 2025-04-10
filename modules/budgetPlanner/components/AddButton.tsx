import { colorPalette } from "@/modules/shared/theme";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

const FloatingAddButton = ({ onPress }: { onPress: VoidFunction }) => {
  return (
    <TouchableOpacity style={[styles.floatingButton]} onPress={onPress}>
      <FontAwesome6 name={"plus"} size={24} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colorPalette.primary, // Dark green to match the image
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default FloatingAddButton;
