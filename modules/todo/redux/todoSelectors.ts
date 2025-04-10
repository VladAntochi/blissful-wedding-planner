import { RootState } from "@/redux/store";
import { ToDoItem } from "./todoSlice";
import { createSelector } from "@reduxjs/toolkit";

export const selectTodoState = (state: RootState) => state.todo;
export const selectAllTodos = (state: RootState): ToDoItem[] => state.todo;
export const selectAllToDosWithDueDate = createSelector(
  [selectTodoState],
  (todos): ToDoItem[] => todos.filter((todo) => !!todo.dueDate)
);
export const selectCompletedTodos = (state: RootState) =>
  state.todo.filter((todo) => todo.completed);
export const selectIncompleteTodos = (state: RootState) =>
  state.todo.filter((todo) => !todo.completed);
export const selectTodoById = (id: string) => (state: RootState) =>
  state.todo.find((todo) => todo.id === id);
export const selectCompletionPercentage = (state: RootState) => {
  const todos = state.todo;
  if (todos.length === 0) return 0;

  const completedCount = todos.filter((todo) => todo.completed).length;
  return Math.round((completedCount / todos.length) * 100);
};
