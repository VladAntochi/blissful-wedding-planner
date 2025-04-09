import { colorPalette } from "@/modules/shared/theme";
import {
  selectWeddingDate,
  selectWeddingDetails,
} from "@/modules/weddingDetails/redux/weddingDetailsSelectors";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const WeddingCountdown: React.FC = () => {
  const weddingDate = useSelector(selectWeddingDate);
  const weddingDetails = useSelector(selectWeddingDetails);
  const [daysLeft, setDaysLeft] = useState<number>(0);

  useEffect(() => {
    const targetDate: Date = new Date(weddingDate);

    const calculateDays = (): void => {
      const now: Date = new Date();
      const difference: number = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setDaysLeft(0);
        return;
      }

      const days: number = Math.ceil(difference / (1000 * 60 * 60 * 24));
      setDaysLeft(days);
    };

    // Calculate immediately
    calculateDays();

    // Then update once per day
    const interval: NodeJS.Timeout = setInterval(calculateDays, 86400000); // 24 hours in milliseconds

    return () => clearInterval(interval);
  }, [weddingDate]);

  // Format the wedding date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wedding Countdown</Text>
      <Text style={styles.date}>{formatDate(weddingDate)}</Text>
      <View style={styles.daysContainer}>
        <Text style={styles.daysValue}>{daysLeft}</Text>
        <Text style={styles.daysLabel}>Days to go</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: -24,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: colorPalette.primary,
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: colorPalette.primary,
  },
  daysContainer: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  daysValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#d4af37",
  },
  daysLabel: {
    fontSize: 12,
  },
});

export default WeddingCountdown;
