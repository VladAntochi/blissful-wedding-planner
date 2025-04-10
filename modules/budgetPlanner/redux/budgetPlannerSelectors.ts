import { RootState } from "@/redux/store";
import { Category } from "./budgetPlannerSlice";

export const selectAllCategories = (state: RootState): Category[] =>
  state.budgetPlanner.categories;
export const selectTotalBudget = (state: RootState): number =>
  state.budgetPlanner.categories.reduce(
    (total, category) => total + category.estimatedBudget,
    0
  );
export const selectTotalSpent = (state: RootState): number => {
  return state.budgetPlanner.categories.reduce((totalSpent, category) => {
    const categorySpent = category.expenses.reduce(
      (categoryTotal, expense) => categoryTotal + expense.amount,
      0
    );
    return totalSpent + categorySpent;
  }, 0);
};

export const selectCategoryById = (id: number) => (state: RootState) =>
  state.budgetPlanner.categories.find((category) => category.id === id);

export const selectTotalSpentForCategoryBasedOnExpenses =
  (categoryId: number) => (state: RootState) => {
    const category = state.budgetPlanner.categories.find(
      (category) => category.id === categoryId
    );
    return category?.expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
  };

export const selectAllPredefinedCategories = (state: RootState) =>
  state.budgetPlanner.predefinedCategories;

export const selectNameOfPredefinedCategory =
  (categoryId?: number | null) => (state: RootState) => {
    const category = state.budgetPlanner.predefinedCategories.find(
      (category) => category.id === categoryId
    );
    return category?.name;
  };
