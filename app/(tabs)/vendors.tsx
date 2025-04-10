import Screen from "@/modules/shared/components/Screen";
import { CategoryFilter } from "@/modules/vendors/components/CategoryFilter";
import VendorCard from "@/modules/vendors/components/VendorCard";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Constants from "expo-constants";
import { AppConfig } from "@/modules/shared/types";
import { useSelector } from "react-redux";
import { selectLocation } from "@/modules/weddingDetails/redux/weddingDetailsSelectors";
import { baseUrl } from "@/modules/shared/utils";

const categoryMap: Record<string, string> = {
  Venues: "wedding venues",
  Photographers: "wedding photographer",
  Videographer: "wedding videographer",
  Caterers: "wedding caterers",
  Florists: "florist",
  Music: "wedding music",
  Decor: "wedding decor",
  Cake: "wedding cake",
  Rings: "wedding rings",
  Dress: "wedding dress, wedding atelier",
  Makeup: "wedding makeup artist",
};

interface Vendor {
  id: string;
  image: string;
  name: string;
  numberOfReviews: number;
  location: string;
  rating: number;
}

export default function Tab() {
  const [selectedCategory, setSelectedCategory] = useState("Venues");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useSelector(selectLocation);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  const categories = Object.keys(categoryMap);

  const mapCategoryToGoogleType = (category: string): string => {
    return categoryMap[category] || "";
  };

  const fetchVendors = async (category: string) => {
    setLoading(true);
    setError(null);

    try {
      const query = mapCategoryToGoogleType(category) + " " + debouncedQuery;

      const url = `${baseUrl}/search-vendors?query=${encodeURIComponent(
        query
      )}&location=${encodeURIComponent(location)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch vendors");
      }

      const data = await response.json();

      setVendors(data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setError("Failed to load vendors. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors(selectedCategory);
  }, [selectedCategory, debouncedQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  return (
    <Screen showBackButton={false}>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <TextInput
        placeholder="🔍 Search vendors..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />

      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2E7D32" />
            <Text style={styles.loadingText}>Loading vendors...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => fetchVendors(selectedCategory)}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {vendors.length > 0 ? (
              vendors.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  image={vendor.image}
                  name={vendor.name}
                  numberOfReviews={vendor.numberOfReviews}
                  location={vendor.location}
                  rating={vendor.rating}
                  onPress={() =>
                    console.log(`Vendor selected: ${vendor.name}`, vendor)
                  }
                />
              ))
            ) : (
              <Text style={styles.noResultsText}>
                No vendors found in this category.
              </Text>
            )}
          </ScrollView>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
    marginTop: 8,
    color: "#333",
  },
});
