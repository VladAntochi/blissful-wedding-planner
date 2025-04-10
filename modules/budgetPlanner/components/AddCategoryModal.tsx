import React, { FC, useEffect, useState } from "react";
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
import { FontAwesome6 } from "@expo/vector-icons";
import { X } from "react-native-feather";
import { colorPalette } from "@/modules/shared/theme";
import RNPickerSelect from "react-native-picker-select";
import {
  createCategory,
  fetchPredefinedCategories,
  PredefinedCategoryType,
} from "../redux/budgetPlannerSlice";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { selectAllPredefinedCategories } from "../redux/budgetPlannerSelectors";
import { AppDispatch } from "@/redux/store";

interface CategoryBudgetModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const CategoryBudgetModal: FC<CategoryBudgetModalProps> = ({
  isVisible,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customCategory, setCustomCategory] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const predefinedCategories = useSelector(selectAllPredefinedCategories);
  const formattedPredefinedCategories = predefinedCategories.map(
    (category) => ({
      label: category.name,
      value: category.id,
    })
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleSave = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      const predefinedName = formattedPredefinedCategories.find(
        (item) => item.value === Number(selectedCategory)
      )?.label;
      await dispatch(
        createCategory({
          token,
          name: customCategory || predefinedName || "",
          estimatedBudget: Number(budgetAmount),
        })
      );
    }
    onClose();
  };

  useEffect(() => {
    const fetchPredefinedCategoriesList = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        await dispatch(fetchPredefinedCategories(token));
      }
    };

    fetchPredefinedCategoriesList();
  }, []);

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
            <Text style={styles.modalTitle}>Category Budget</Text>
            <Pressable onPress={onClose}>
              <X color="#000" />
            </Pressable>
          </View>

          {/* Category Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Category</Text>
            <RNPickerSelect
              onValueChange={(value) => setSelectedCategory(value)}
              items={formattedPredefinedCategories}
              placeholder={{ label: "Choose a category", value: null }}
              useNativeAndroidPickerStyle={false}
              Icon={() => (
                <FontAwesome6 name="chevron-down" color="#888" size={20} />
              )}
            />
          </View>

          {/* Custom Category Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Custom Category Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter category name"
              value={customCategory}
              onChangeText={setCustomCategory}
              placeholderTextColor={"#888"}
            />
          </View>

          {/* Budget Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Estimated Budget</Text>
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

export default CategoryBudgetModal;
