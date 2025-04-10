import FloatingAddButton from "@/modules/budgetPlanner/components/AddButton";
import CategoryBudgetModal from "@/modules/budgetPlanner/components/AddCategoryModal";
import { InfoCard } from "@/modules/shared/components/InfoCard";
import {
  selectAllCategories,
  selectTotalBudget,
  selectTotalSpent,
} from "@/modules/budgetPlanner/redux/budgetPlannerSelectors";
import Screen from "@/modules/shared/components/Screen";
import { Spacer } from "@/modules/shared/components/Spacer";
import { colorPalette } from "@/modules/shared/theme";
import { Fragment, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CategoryCard } from "@/modules/budgetPlanner/components/CategoryCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchCategories } from "@/modules/budgetPlanner/redux/budgetPlannerSlice";
import { AppDispatch } from "@/redux/store";

export default function BudgetScreen() {
  const categories = useSelector(selectAllCategories);
  const totalBudget = useSelector(selectTotalBudget);
  const totalSpent = useSelector(selectTotalSpent);
  const dispatch = useDispatch<AppDispatch>();

  const [isModalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  useEffect(() => {
    const fetchCategoriesList = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        await dispatch(fetchCategories(token));
      }
    };

    fetchCategoriesList();
  }, [dispatch]);

  return (
    <Screen showBackButton title="Budget">
      <ScrollView>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Fragment key={"budget-card"}>
            <InfoCard
              title="Total Budget"
              value={`£${totalBudget}`}
              color={colorPalette.primary}
            />
            <Spacer size={8} orientation="row" />
          </Fragment>
          <Fragment key={"spent-card"}>
            <>
              <InfoCard
                title="Spent"
                value={`£${totalSpent}`}
                color={colorPalette.secondary}
              />
              <Spacer size={8} orientation="row" />
            </>
            <Spacer size={8} orientation="row" />
          </Fragment>
          <Fragment key={"remaining-card"}>
            <InfoCard
              title="Remaining"
              value={`£${totalBudget - totalSpent}`}
              color={colorPalette.primaryLight}
            />
            <Spacer size={8} orientation="row" />
          </Fragment>
        </View>
        <Spacer size={24} />
        {categories.map((category) => {
          return <CategoryCard category={category} key={category.id} />;
        })}
      </ScrollView>
      <FloatingAddButton onPress={handleOpenModal} />
      <CategoryBudgetModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
      />
    </Screen>
  );
}
