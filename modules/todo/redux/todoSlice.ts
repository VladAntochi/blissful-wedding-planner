import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import uuid from "react-native-uuid";
import {
  createTodo,
  getTodos,
  markTodoCompleted,
  removeTodoFromList,
  updateTodoDueDate,
} from "../api/todoApi";
import { format } from "date-fns";

export interface ToDoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

const initialState: ToDoItem[] = [];

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async (token: string, { dispatch }) => {
    const response = await getTodos(token);
    dispatch(setAllToDos(response.todos));
    return response.todos;
  }
);

export const createNewTodo = createAsyncThunk(
  "todos/createNewTodo",
  async (
    args: { token: string; title: string; dueDate?: string },
    { dispatch }
  ) => {
    const response = await createTodo(
      args.token,
      args.title,
      args.dueDate
        ? format(new Date(args.dueDate), "yyyy-MM-dd HH:mm:ss")
        : undefined
    );
    dispatch(addTodo(response.todo));
    return response.todo;
  }
);

export const completeTodo = createAsyncThunk(
  "todos/completeTodo",
  async (args: { token: string; todoId: string }, { dispatch }) => {
    await markTodoCompleted(args.token, args.todoId);
    dispatch(toggleTodo(args.todoId));
    return args.todoId;
  }
);

export const removeTodoItem = createAsyncThunk(
  "todos/removeTodo",
  async (args: { token: string; todoId: string }, { dispatch }) => {
    await removeTodoFromList(args.token, args.todoId);
    dispatch(removeTodo(args.todoId));
    return args.todoId;
  }
);

export const updateDueDate = createAsyncThunk(
  "todos/updateDueDate",
  async (
    args: { token: string; todoId: string; dueDate: string },
    { dispatch }
  ) => {
    await updateTodoDueDate(args.token, args.todoId, args.dueDate);
    dispatch(setDueDate({ dueDate: args.dueDate, id: args.todoId }));
    return { todoId: args.todoId, dueDate: args.dueDate };
  }
);

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.push({
        id: action.payload.id,
        title: action.payload.title,
        dueDate: action.payload.dueDate,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    },
    toggleTodo: (state, action) => {
      const todo = state.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        todo.updatedAt = new Date().toISOString();
      }
    },
    removeTodo: (state, action) => {
      return state.filter((todo) => todo.id !== action.payload);
    },
    setDueDate: (state, action) => {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.dueDate = action.payload.dueDate;
      }
    },
    setAllToDos: (state, action) => {
      const todos = action.payload.map((todo: any) => ({
        id: String(todo.id),
        title: todo.title,
        completed: todo.completed === 1,
        dueDate: todo.due_date || null,
      }));

      return todos;
    },
  },
});

export const { addTodo, toggleTodo, removeTodo, setDueDate, setAllToDos } =
  todoSlice.actions;
