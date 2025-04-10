import { Spacer } from "@/modules/shared/components/Spacer";
import { StyleSheet, Text, View } from "react-native";

export const InfoCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) => {
  return (
    <View style={styles.budgetCardContainer}>
      <Text style={styles.budgetCardTitle}>{title}</Text>
      <Spacer size={8} />
      <Text style={{ ...styles.budgetCardValue, color }}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  budgetCardTitle: {
    fontSize: 14,
    color: "#333",
  },
  budgetCardValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  budgetCardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
});
