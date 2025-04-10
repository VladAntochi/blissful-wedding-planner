import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Check, MoreVertical } from "react-native-feather";
import { TodoItemModal } from "./ToDoItemModal";
import { calculateToDoDueDate } from "@/modules/shared/utils";
import { ToDoItem } from "../redux/todoSlice";

interface TodoItemProps {
  todo: ToDoItem;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleComplete,
  onDelete,
}) => {
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);

  const dueDate = todo.dueDate
    ? calculateToDoDueDate(new Date(todo.dueDate))
    : undefined;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.checkbox,
          todo.completed
            ? styles.checkboxCompleted
            : styles.checkboxNotCompleted,
        ]}
        onPress={() => onToggleComplete(todo.id)}
      >
        {todo.completed && <Check stroke="#2E6D4A" width={16} height={16} />}
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={[styles.todoText, todo.completed && styles.completedText]}>
          {todo.title}
        </Text>
        <Text style={styles.dueDate}>{dueDate}</Text>
      </View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <MoreVertical stroke="#9CA3AF" width={20} height={20} />
      </TouchableOpacity>
      <TodoItemModal
        id={todo.id}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onDeleteItem={(id) => onDelete(id)}
        initialDueDate={todo.dueDate ? new Date(todo.dueDate) : new Date()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  checkboxNotCompleted: {
    borderColor: "#9CA3AF", // Gray outline for not completed
    backgroundColor: "transparent",
  },
  checkboxCompleted: {
    borderColor: "#2E6D4A", // Green outline for completed
    backgroundColor: "#E6F4EA", // Light green background
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  todoText: {
    fontSize: 16,
    fontWeight: 500,
    color: "#222",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#757575",
  },
  dueDate: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
});

export default TodoItem;
