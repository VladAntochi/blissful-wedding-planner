import { baseUrl } from "@/modules/shared/utils";
import { format } from "date-fns";

export const getTodos = async (token: string) => {
  const response = await fetch(`${baseUrl}/todos/todos`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch ToDos");
  }

  const data = await response.json();
  return data;
};

export const createTodo = async (
  token: string,
  title: string,
  dueDate?: string
) => {
  const response = await fetch(`${baseUrl}/todos/todos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      dueDate,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create ToDo");
  }

  const data = await response.json();
  return data;
};

export const markTodoCompleted = async (token: string, todoId: string) => {
  const response = await fetch(`${baseUrl}/todos/todos/${todoId}/complete`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to mark ToDo as completed");
  }

  const data = await response.json();
  return data;
};

export const removeTodoFromList = async (token: string, todoId: string) => {
  const response = await fetch(`${baseUrl}/todos/todos/${todoId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete ToDo");
  }

  const data = await response.json();
  return data;
};

export const updateTodoDueDate = async (
  token: string,
  todoId: string,
  dueDate: string
) => {
  const response = await fetch(`${baseUrl}/todos/todos/${todoId}/due-date`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dueDate: dueDate
        ? format(new Date(dueDate), "yyyy-MM-dd HH:mm:ss")
        : undefined,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update due date");
  }

  const data = await response.json();
  return data;
};
