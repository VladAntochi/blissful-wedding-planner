import React, { FC } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";

interface PlanningToolsCardProps {
  title: string;
  subtitle: string;
  icon?: string;
  onPress?: () => void;
}

export const PlanningToolsCard: FC<PlanningToolsCardProps> = ({
  title,
  subtitle,
  icon,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <FontAwesome6 name={icon} size={24} color="#4C8056" />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.subtitleText}>{subtitle}</Text>
      </View>
      <View style={styles.chevronContainer}>
        <Feather name="chevron-right" size={24} color="#A0AEC0" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#E6F4ED",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  titleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E4C38",
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 12,
    color: "#718096",
  },
  chevronContainer: {
    justifyContent: "center",
  },
});
