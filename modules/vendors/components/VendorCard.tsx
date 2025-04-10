import { Spacer } from "@/modules/shared/components/Spacer";
import React, { FC } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

interface VendorCardProps {
  image: string;
  name: string;
  rating?: number;
  numberOfReviews?: number;
  location: string;
  onPress: () => void;
}

const VendorCard: FC<VendorCardProps> = ({
  image,
  name,
  rating,
  numberOfReviews = 0,
  location,
  onPress,
}) => {
  const handleImageError = (e: any) => {
    console.error("Image loading error:", e);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image
        source={{ uri: image }}
        style={styles.image}
        onError={handleImageError}
        defaultSource={require("../../../assets/images/favicon.png")} // Make sure to add a placeholder image in your assets
      />

      <View style={styles.contentContainer}>
        <View style={styles.headingRow}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
        </View>
        <View style={styles.locationContainer}>
          <Text style={styles.location} numberOfLines={1}>
            {`📍 ${location}`}
          </Text>
        </View>
        <Spacer size={8} />
        {rating && (
          <View style={styles.locationContainer}>
            <Text style={styles.ratingText}>{`${rating.toFixed(1)} ⭐`}</Text>
            <Text
              style={styles.location}
            >{`(${numberOfReviews} reviews)`}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    backgroundColor: "#f0f0f0",
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  ratingText: {
    fontWeight: "bold",
    marginLeft: 4,
    fontSize: 12,
  },
  contentContainer: {
    padding: 12,
  },
  headingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E8B57",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 12,
    color: "#666",
    flex: 1,
  },
});

export default VendorCard;
