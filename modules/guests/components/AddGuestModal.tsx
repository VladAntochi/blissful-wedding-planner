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
import { useDispatch } from "react-redux";
import { createGuest } from "../redux/guestsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppDispatch } from "@/redux/store";

interface AddGuestModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const AddGuestModal: FC<AddGuestModalProps> = ({ isVisible, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSave = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      await dispatch(createGuest({ name, email, status: "invited", token }));
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
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Category Budget</Text>
            <Pressable onPress={onClose}>
              <X color="#000" />
            </Pressable>
          </View>

          {/* Category Dropdown */}
          {/* <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Category</Text>
            <RNPickerSelect
              onValueChange={(value) => setSelectedCategory(value)}
              items={items}
              placeholder={{ label: "Choose a category", value: null }}
              useNativeAndroidPickerStyle={false}
              Icon={() => (
                <FontAwesome6 name="chevron-down" color="#888" size={20} />
              )}
            />
          </View> */}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Guest Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter guest name"
              value={name}
              onChangeText={setName}
              placeholderTextColor={"#888"}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.budgetInput}
                placeholder="Enter guest email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor={"#888"}
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Add guest</Text>
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

export default AddGuestModal;
