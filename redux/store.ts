import { authSlice } from "@/modules/auth/redux/authSlice";
import { budgetPlannerSlice } from "@/modules/budgetPlanner/redux/budgetPlannerSlice";
import { guestsSlice } from "@/modules/guests/redux/guestsSlice";
import { todoSlice } from "@/modules/todo/redux/todoSlice";
import { weddingDetailsSlice } from "@/modules/weddingDetails/redux/weddingDetailsSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    todo: todoSlice.reducer,
    budgetPlanner: budgetPlannerSlice.reducer,
    guests: guestsSlice.reducer,
    weddingDetails: weddingDetailsSlice.reducer,
    auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
