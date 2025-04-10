import React, { FC, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { X } from "react-native-feather";
import { colorPalette } from "@/modules/shared/theme";
import {
  createExpense,
  PredefinedCategoryType,
} from "../redux/budgetPlannerSlice";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppDispatch } from "@/redux/store";

interface ExpenseModalProps {
  isVisible: boolean;
  onClose: () => void;
  categoryId: number;
}

const ExpenseModal: FC<ExpenseModalProps> = ({
  isVisible,
  onClose,
  categoryId,
}) => {
  const [expenseTitle, setExpenseTitle] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSave = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      dispatch(
        createExpense({
          token,
          categoryId,
          title: expenseTitle,
          amount: Number(budgetAmount),
        })
      );
    }

    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Expense</Text>
            <Pressable onPress={onClose}>
              <X color="#000" />
            </Pressable>
          </View>

          {/* Custom Category Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Expense Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter expense name"
              value={expenseTitle}
              onChangeText={setExpenseTitle}
              placeholderTextColor={"#888"}
            />
          </View>

          {/* Budget Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Expense amount</Text>
            <View style={styles.inputWithIcon}>
              <Text style={styles.dollarSign}>£</Text>
              <TextInput
                style={styles.budgetInput}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={budgetAmount}
                onChangeText={setBudgetAmount}
                placeholderTextColor={"#888"}
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Category Budget</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    color: "#333",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
  },
  dropdownText: {
    color: "#888",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  dollarSign: {
    paddingLeft: 12,
    color: "#888",
  },
  budgetInput: {
    flex: 1,
    padding: 12,
    paddingLeft: 5,
  },
  saveButton: {
    backgroundColor: colorPalette.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 24,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default ExpenseModal;
