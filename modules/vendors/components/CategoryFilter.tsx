import { FC } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.scrollViewContainer}
    contentContainerStyle={styles.categoryContent}
  >
    {categories.map((category) => (
      <TouchableOpacity
        key={category}
        style={[
          styles.categoryButton,
          selectedCategory === category && styles.selectedCategoryButton,
        ]}
        onPress={() => onSelectCategory(category)}
      >
        <Text
          style={[
            styles.categoryText,
            selectedCategory === category && styles.selectedCategoryText,
          ]}
        >
          {category}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  scrollViewContainer: {
    backgroundColor: "white",
    maxHeight: 56, // prevents the ScrollView from getting too tall
    marginHorizontal: -16,
  },
  categoryContent: {
    flexDirection: "row",
    alignItems: "center", // make sure buttons align vertically
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: "#f0f0f0",
  },
  selectedCategoryButton: {
    backgroundColor: "#2E7D32",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  selectedCategoryText: {
    color: "white",
    fontWeight: "bold",
  },
});
