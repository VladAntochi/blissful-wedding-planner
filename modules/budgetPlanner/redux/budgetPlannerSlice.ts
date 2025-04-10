import { baseUrl } from "@/modules/shared/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type PredefinedCategoryType =
  | "Venue"
  | "Photography"
  | "Catering"
  | "Florist"
  | "Music"
  | "Transportation"
  | "Attire"
  | "Stationery"
  | "Gifts"
  | "Jewelry"
  | "Hair & Makeup"
  | "Accommodations"
  | "Honeymoon"
  | "Beverages"
  | "Cake";

type CategoryType = PredefinedCategoryType | string;

export interface Category {
  id: number;
  name: CategoryType | string;
  estimatedBudget: number;
  spent: number;
  expenses: Expense[];
  predefinedCategoryId?: number | null;
}

interface Expense {
  id: number;
  title: string;
  amount: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

interface BudgetPlannerState {
  categories: Category[];
  predefinedCategories: PredefinedCategory[];
}

const initialState: BudgetPlannerState = {
  categories: [],
  predefinedCategories: [],
};

export const fetchCategories = createAsyncThunk<Category[], string>(
  "categories/fetchCategories",
  async (token, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`${baseUrl}/budgetPlanner/categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch categories");
      }

      const data = await response.json();
      dispatch(setCategories(data.categories));
      return data.categories;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch categories");
    }
  }
);

// Create Category AsyncThunk
export const createCategory = createAsyncThunk<
  Category,
  {
    token: string;
    name: string;
    predefinedCategoryId?: number | null;
    estimatedBudget: number;
  },
  { rejectValue: string }
>(
  "categories/createCategory",
  async (
    { token, name, predefinedCategoryId, estimatedBudget },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await fetch(`${baseUrl}/budgetPlanner/categories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          predefinedCategoryId: predefinedCategoryId,
          estimatedBudget: estimatedBudget,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create category");
      }

      const data = await response.json();
      dispatch(
        addCategory({
          name: data.category.name,
          predefinedCategoryId: data.category.predefinedCategoryId,
          id: data.category.id,
          estimatedBudget: Number(data.category.estimatedBudget),
        })
      );
      return data.category;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create category");
    }
  }
);

// Fetch Expenses for a Category AsyncThunk
export const fetchExpenses = createAsyncThunk<
  Expense[],
  { token: string; categoryId: number }
>(
  "expenses/fetchExpenses",
  async ({ token, categoryId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(
        `${baseUrl}/budgetPlanner/expenses/${categoryId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch expenses");
      }

      const data = await response.json();
      dispatch(updateCategoryExpenses({ expenses: data.expenses, categoryId }));
      return data.expenses;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch expenses");
    }
  }
);

// Create Expense AsyncThunk
export const createExpense = createAsyncThunk<
  Expense,
  { token: string; categoryId: number; title: string; amount: number },
  { rejectValue: string }
>(
  "expenses/createExpense",
  async (
    { token, categoryId, title, amount },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await fetch(`${baseUrl}/budgetPlanner/expenses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryId, title, amount }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create expense");
      }

      const data = await response.json();
      dispatch(
        addExpense({
          categoryId,
          title: data.expense.title,
          amount: Number(data.expense.amount),
        })
      );
      return data.expense;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create expense");
    }
  }
);

interface PredefinedCategory {
  id: number;
  name: string;
}

// Fetch Predefined Categories AsyncThunk
export const fetchPredefinedCategories = createAsyncThunk<
  PredefinedCategory[],
  string
>(
  "categories/fetchPredefinedCategories",
  async (token, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(
        `${baseUrl}/budgetPlanner/predefined-categories`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Passing token for authentication
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Failed to fetch predefined categories"
        );
      }

      const data = await response.json();
      dispatch(setPredefinedCategories(data.categories));
      return data.categories; // Assuming the response contains an array of categories
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch predefined categories"
      );
    }
  }
);

export const budgetPlannerSlice = createSlice({
  name: "timeline",
  initialState,
  reducers: {
    addCategory: (state, action) => {
      state.categories.push({
        id: action.payload.id,
        name: action.payload.name,
        estimatedBudget: action.payload.estimatedBudget,
        predefinedCategoryId: action.payload.predefinedCategoryId,
        spent: 0,
        expenses: [],
      });
    },
    addExpense: (state, action) => {
      const categoryIndex = state.categories.findIndex(
        (category) => category.id === action.payload.categoryId
      );
      state.categories[categoryIndex].expenses.push({
        id: action.payload.id,
        title: action.payload.title,
        amount: action.payload.amount,
        categoryId: action.payload.categoryId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    },
    setPredefinedCategories: (state, action) => {
      state.predefinedCategories = action.payload.map((category: any) => ({
        id: category.id,
        name: category.name,
        estimatedBudget: 0,
        spent: 0,
        expenses: [],
      }));
    },
    setCategories: (state, action) => {
      state.categories = action.payload.map((category: any) => ({
        id: category.id,
        name: category.name,
        estimatedBudget: Number(category.estimated_budget),
        spent: 0,
        expenses: [],
      }));
    },
    updateCategoryExpenses: (state, action) => {
      const categoryIndex = state.categories.findIndex(
        (category) => category.id === action.payload.categoryId
      );
      if (categoryIndex !== -1) {
        state.categories[categoryIndex].expenses = action.payload.expenses.map(
          (expense: any) => {
            return {
              id: expense.id,
              title: expense.title,
              amount: Number(expense.amount),
              categoryId: expense.category_id,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          }
        );
      }
    },
  },
});

export const {
  addCategory,
  addExpense,
  setPredefinedCategories,
  setCategories,
  updateCategoryExpenses,
} = budgetPlannerSlice.actions;
export default budgetPlannerSlice.reducer;
