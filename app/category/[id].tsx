import FloatingAddButton from "@/modules/budgetPlanner/components/AddButton";
import ExpenseModal from "@/modules/budgetPlanner/components/AddExpenseModal";
import { InfoCard } from "@/modules/shared/components/InfoCard";
import {
  selectCategoryById,
  selectTotalSpentForCategoryBasedOnExpenses,
} from "@/modules/budgetPlanner/redux/budgetPlannerSelectors";
import { Card } from "@/modules/shared/components/Card";
import Screen from "@/modules/shared/components/Screen";
import { Spacer } from "@/modules/shared/components/Spacer";
import { colorPalette } from "@/modules/shared/theme";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppDispatch } from "@/redux/store";
import { fetchExpenses } from "@/modules/budgetPlanner/redux/budgetPlannerSlice";

export default function CategoryScreen() {
  const params = useLocalSearchParams();
  const id = Number(Array.isArray(params.id) ? params.id[0] : params.id);
  const category = useSelector(selectCategoryById(id));
  const totalSpent = useSelector(
    selectTotalSpentForCategoryBasedOnExpenses(id)
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  useEffect(() => {
    const fetchExpensesList = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        await dispatch(fetchExpenses({ token, categoryId: id }));
      }
    };

    fetchExpensesList();
  }, [dispatch]);

  return (
    <Screen showBackButton title="Category">
      <ScrollView>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <>
            <InfoCard
              title="Total Budget"
              value={`£${category?.estimatedBudget}`}
              color={colorPalette.primary}
            />
            <Spacer size={8} orientation="row" />
          </>
          <>
            <>
              <InfoCard
                title="Spent"
                value={`£${totalSpent}`}
                color={colorPalette.secondary}
              />
              <Spacer size={8} orientation="row" />
            </>
            <Spacer size={8} orientation="row" />
          </>
          {!!category?.estimatedBudget && !!totalSpent && (
            <>
              <InfoCard
                title="Remaining"
                value={`£${category?.estimatedBudget - totalSpent}`}
                color={colorPalette.primaryLight}
              />
              <Spacer size={8} orientation="row" />
            </>
          )}
        </View>
        <Spacer size={24} />
        {category?.expenses.map((expense) => {
          return (
            <View key={expense.id}>
              <Card width={"100%"} key={expense.title}>
                <View style={styles.progressRow}>
                  <Text style={styles.sectionTitle}>{expense.title}</Text>
                  <Text
                    style={styles.progressPercentage}
                  >{`£${expense.amount}`}</Text>
                </View>
              </Card>
              <Spacer size={8} />
            </View>
          );
        })}
      </ScrollView>
      <FloatingAddButton onPress={handleOpenModal} />
      <ExpenseModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        categoryId={id}
      />
    </Screen>
  );
}

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
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2e6d46",
  },
});
