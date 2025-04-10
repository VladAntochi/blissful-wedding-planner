import { Card } from "@/modules/shared/components/Card";
import { Spacer } from "@/modules/shared/components/Spacer";
import { router } from "expo-router";
import { FC, Fragment, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Category, fetchExpenses } from "../redux/budgetPlannerSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  selectNameOfPredefinedCategory,
  selectTotalSpentForCategoryBasedOnExpenses,
} from "../redux/budgetPlannerSelectors";
import { AppDispatch } from "@/redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: FC<CategoryCardProps> = ({ category }) => {
  const { name, estimatedBudget, predefinedCategoryId } = category;
  const dispatch = useDispatch<AppDispatch>();
  const spent =
    useSelector(selectTotalSpentForCategoryBasedOnExpenses(category.id)) ?? 0;
  const progress = Math.min((spent / estimatedBudget) * 100, 100);
  const categoryName =
    name ?? useSelector(selectNameOfPredefinedCategory(predefinedCategoryId));

  useEffect(() => {
    const fetchExpensesList = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        await dispatch(fetchExpenses({ token, categoryId: category.id }));
      }
    };

    fetchExpensesList();
  }, [dispatch]);
  return (
    <Fragment key={category.id}>
      <Card width={"100%"} key={name}>
        <TouchableOpacity
          onPress={() => router.push(`/category/${category.id}`)}
        >
          <View style={styles.progressRow}>
            <Text style={styles.sectionTitle}>{categoryName}</Text>
            <Text
              style={styles.progressPercentage}
            >{`£${estimatedBudget}`}</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          <Spacer size={8} />
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>{`Spent: £${spent}`}</Text>
            <Text style={styles.progressLabel}>{`Remaining: ${
              estimatedBudget - spent < 0
                ? "Budget exceeded"
                : `£${estimatedBudget - spent}`
            }`}</Text>
          </View>
        </TouchableOpacity>
      </Card>
      <Spacer size={8} />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
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
    color: "#2e6d46",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#f0c14b",
    borderRadius: 4,
  },
});
