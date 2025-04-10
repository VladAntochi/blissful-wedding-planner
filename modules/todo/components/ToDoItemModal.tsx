import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar, Trash } from "react-native-feather";
import { colorPalette } from "@/modules/shared/theme";
import { Spacer } from "@/modules/shared/components/Spacer";
import { updateDueDate } from "../redux/todoSlice";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppDispatch } from "@/redux/store";

interface ItemOptionsModalProps {
  id: string;
  visible: boolean;
  onClose: () => void;
  onDeleteItem: (id: string) => void;
  initialDueDate: Date;
  onDueDateSet?: (id: string, date: Date | null) => void; // Add this callback
}

export const TodoItemModal: React.FC<ItemOptionsModalProps> = ({
  id,
  visible,
  onClose,
  onDeleteItem,
  initialDueDate,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showPicker, setShowPicker] = useState(false);

  const onSetDueDate = async (id: string, date?: Date) => {
    if (!date) return;
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      await dispatch(
        updateDueDate({
          token,
          todoId: id,
          dueDate: date.toISOString(),
        })
      );
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Item Options</Text>
              <TouchableOpacity onPress={onClose}>
                <AntDesign name="close" size={20} color="#999" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.option}
              onPress={() => onDeleteItem(id)}
            >
              <Trash width={22} height={22} stroke={colorPalette.typography} />
              <Spacer size={12} orientation="row" />
              <Text style={styles.text}>Delete Item</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => setShowPicker(true)}
            >
              <Calendar
                width={22}
                height={22}
                stroke={colorPalette.typography}
              />
              <Spacer size={12} orientation="row" />
              <Text style={styles.text}>Set due date</Text>
              {showPicker && (
                <DateTimePicker
                  value={initialDueDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowPicker(false);
                    if (event.type === "set" && date) {
                      onSetDueDate(id, date);
                    }
                  }}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  optionIconContainer: {
    width: 28,
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: colorPalette.typography,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  cancelText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});
