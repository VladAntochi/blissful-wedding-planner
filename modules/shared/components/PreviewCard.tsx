import { FC } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { colorPalette } from "../theme";

interface PreviewCardProps {
  title: string;
  subtitle?: string;
  icon: string;
  data: { id: string; title: string; date?: string }[];
  onPress: () => void;
}

export const PreviewCard: FC<PreviewCardProps> = ({
  title,
  subtitle,
  icon,
  data,
  onPress,
}) => {
  const renderItem = ({
    item,
  }: {
    item: { id: string; title: string; date?: string };
  }) => (
    <View style={styles.item}>
      <View
        style={[styles.eventDot, { backgroundColor: colorPalette.secondary }]}
      />
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        {item.date && <Text style={styles.itemDate}>{item.date}</Text>}
      </View>
    </View>
  );

  return (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <FontAwesome6 name={icon} size={20} color="#42855B" />
        </View>
        <Text style={styles.viewAll}>View all</Text>
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <FlatList
        data={data.slice(0, 2)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    // backgroundColor: "white",
    // borderRadius: 12,
    // padding: 16,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
    // marginVertical: 8,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8F3ED",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  viewAll: {
    fontSize: 12,
    color: "#42855B",
  },
  subtitle: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  eventDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  itemDate: {
    fontSize: 12,
    color: "#888",
  },
});
