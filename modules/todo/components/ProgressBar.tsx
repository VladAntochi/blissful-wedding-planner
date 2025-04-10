import { Card } from "@/modules/shared/components/Card";
import { StyleSheet, Text, View } from "react-native";

interface PlanningProgressProps {
  progressPercentage: number;
}

export const PlanningProgress: React.FC<PlanningProgressProps> = ({
  progressPercentage = 65,
}) => {
  return (
    <Card>
      <Text style={styles.sectionTitle}>Planning Progress</Text>

      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>Tasks Completed</Text>
        <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View
          style={[styles.progressBarFill, { width: `${progressPercentage}%` }]}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: "#666",
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2e6d46", // Green to match your theme
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#f0c14b", // Gold color from your theme
    borderRadius: 4,
  },
});
