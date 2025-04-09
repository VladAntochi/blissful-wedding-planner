import { colorPalette } from "@/modules/shared/theme";
import { FontAwesome } from "@expo/vector-icons";
import { format, parse } from "date-fns";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface WeddingDetailsProps {
  location?: string;
  time?: string;
  guestCount?: number;
  dressCode?: string;
}

const WeddingDetails: React.FC<WeddingDetailsProps> = ({
  location,
  time,
  guestCount,
  dressCode,
}) => {
  const formattedTime = time
    ? format(parse(time, "HH:mm:ss", new Date()), "HH:mm")
    : undefined;
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Wedding Details</Text>
      </View>

      <View style={styles.detailItem}>
        <FontAwesome
          size={18}
          name="location-arrow"
          color={colorPalette.secondary}
          style={{ paddingRight: 8 }}
        />
        <Text style={styles.detailText}>{location}</Text>
      </View>

      <View style={styles.detailItem}>
        <FontAwesome
          size={18}
          name="clock-o"
          color={colorPalette.secondary}
          style={{ paddingRight: 8 }}
        />
        <Text style={styles.detailText}>{formattedTime}</Text>
      </View>

      <View style={styles.detailItem}>
        <FontAwesome
          size={18}
          name="users"
          color={colorPalette.secondary}
          style={{ paddingRight: 8 }}
        />
        <Text style={styles.detailText}>{guestCount} Guests Expected</Text>
      </View>

      <View style={styles.detailItem}>
        <FontAwesome
          size={18}
          name="user"
          color={colorPalette.secondary}
          style={{ paddingRight: 8 }}
        />
        <Text style={styles.detailText}>{dressCode}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2e6d46", // Green color matching previous component
  },
  editButton: {
    padding: 4,
  },
  editIcon: {
    fontSize: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  icon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
    textAlign: "center",
  },
  detailText: {
    fontSize: 16,
    color: "#333",
  },
});

export default WeddingDetails;
