import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Calendar, Plus } from "react-native-feather";
import TodoItem from "./TodoItem";
import { useDispatch, useSelector } from "react-redux";
import { selectAllTodos } from "../redux/todoSelectors";
import {
  completeTodo,
  createNewTodo,
  removeTodoItem,
  ToDoItem,
} from "../redux/todoSlice";
import { Spacer } from "@/modules/shared/components/Spacer";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colorPalette } from "@/modules/shared/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppDispatch } from "@/redux/store";

const TodoList: React.FC = () => {
  const todos = useSelector(selectAllTodos);
  const dispatch = useDispatch<AppDispatch>();
  const [newTodoText, setNewTodoText] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const addTodoItem = async () => {
    if (newTodoText.trim() === "") return;
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      await dispatch(
        createNewTodo({
          token,
          title: newTodoText.trim(),
          dueDate: dueDate?.toISOString(),
        })
      );

      // Scroll to the bottom after adding a new item
      setTimeout(() => {
        if (flatListRef.current && todos.length > 0) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 300);
    }
    setNewTodoText("");
    setDueDate(null);
  };

  const toggleTodoComplete = async (id: string) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      await dispatch(
        completeTodo({
          token,
          todoId: id,
        })
      );
    }
  };

  const showAlert = (id: string): void =>
    Alert.alert("Are you sure you want to delete?", "", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => deleteTodo(id) },
    ]);

  const deleteTodo = async (id: string) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      await dispatch(
        removeTodoItem({
          token,
          todoId: id,
        })
      );
    }
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setDatePickerVisibility(false); // Close the date picker once a date is selected
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const renderItem = ({ item }: { item: ToDoItem }) => (
    <TodoItem
      todo={item}
      onToggleComplete={toggleTodoComplete}
      onDelete={showAlert}
    />
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0}
      style={styles.keyboardAvoidingView}
    >
      <View style={styles.header}>
        <Text style={styles.title}>All tasks</Text>
        <Text style={styles.subtitle}>
          {todos.filter((todo) => !todo.completed).length} tasks remaining
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled" // Allow taps when keyboard is open
        showsVerticalScrollIndicator={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={Platform.OS === "android"} // Improve performance on Android
        onEndReachedThreshold={0.5}
      />

      {/* Input and Buttons */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTodoText}
          onChangeText={setNewTodoText}
          placeholder="Add new task..."
          placeholderTextColor="#9CA3AF"
          returnKeyType="done"
          onSubmitEditing={addTodoItem}
        />
        <Spacer size={12} orientation="row" />

        {/* Date Button */}
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setDatePickerVisibility(true)}
        >
          <Calendar width={24} height={24} stroke="#fff" />
        </TouchableOpacity>

        <Spacer size={12} orientation="row" />

        {/* Add Todo Button */}
        <TouchableOpacity style={styles.addButton} onPress={addTodoItem}>
          <Plus width={24} height={24} stroke="#fff" />
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      {isDatePickerVisible && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dueDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 100,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 20,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#757575",
    marginTop: 8,
  },
  input: {
    flex: 1,
    minHeight: 48,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: colorPalette.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dateButton: {
    width: 48,
    height: 48,
    backgroundColor: colorPalette.primaryLight,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TodoList;
