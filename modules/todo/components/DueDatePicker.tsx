import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

interface DueDatePickerProps {
  visible: boolean;
  onClose: () => void;
  onSave: (date: Date | null) => void;
  initialDate: Date | null;
  itemId: string;
}

export const DueDatePicker: React.FC<DueDatePickerProps> = ({
  visible,
  onClose,
  onSave,
  initialDate,
  itemId,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    initialDate || new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState<boolean>(
    Platform.OS === "ios"
  );

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (event.type === "set" && date) {
      setSelectedDate(date);
    }
  };

  const handleSave = () => {
    onSave(selectedDate);
    onClose();
  };

  const handleRemoveDueDate = () => {
    onSave(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Set Due Date</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Date Display */}
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={24} color="#265D4C" />
            <Text style={styles.dateText}>
              {selectedDate ? selectedDate.toDateString() : "No date selected"}
            </Text>
          </View>

          {/* Android Date Picker Trigger */}
          {Platform.OS === "android" && !showDatePicker && (
            <TouchableOpacity
              style={styles.datePickerTrigger}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerTriggerText}>
                {selectedDate ? "Change Date" : "Select Date"}
              </Text>
            </TouchableOpacity>
          )}

          {/* Date Picker */}
          {(Platform.OS === "ios" || showDatePicker) && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              style={styles.datePicker}
              minimumDate={new Date()}
            />
          )}

          {/* Remove Date Button */}
          {initialDate && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={handleRemoveDueDate}
            >
              <Ionicons name="trash-outline" size={18} color="#E53935" />
              <Text style={styles.removeText}>Remove Due Date</Text>
            </TouchableOpacity>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    marginLeft: 12,
  },
  datePickerTrigger: {
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  datePickerTriggerText: {
    color: "#265D4C",
    fontWeight: "500",
  },
  datePicker: {
    marginBottom: 16,
    ...(Platform.OS === "ios" ? { height: 180 } : {}),
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 16,
  },
  removeText: {
    color: "#E53935",
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginRight: 8,
  },
  cancelText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#265D4C",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginLeft: 8,
  },
  saveText: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
  },
});
