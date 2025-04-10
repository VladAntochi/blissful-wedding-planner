import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colorPalette } from "@/modules/shared/theme";
import { setAllWeddingDetails } from "@/modules/weddingDetails/redux/weddingDetailsSlice";
import { useDispatch } from "react-redux";
import { baseUrl } from "@/modules/shared/utils";
import AsyncStorage from "@react-native-async-storage/async-storage"; // or expo-secure-store if you prefer

interface FormData {
  brideName: string;
  groomName: string;
  weddingDate: Date;
  time: Date;
  location: string;
  guestCount: number;
  dressCode: string;
  venue: string;
}

interface FormErrors {
  brideName: string;
  groomName: string;
  location: string;
  venue: string;
  guestCount: string;
  dressCode: string;
  [key: string]: string;
}

const STEPS = {
  COUPLE_NAMES: 0,
  DATE_TIME: 1,
  LOCATION: 2,
  GUESTS_CODE: 3,
  SUMMARY: 4,
};

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(STEPS.COUPLE_NAMES);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    brideName: "",
    groomName: "",
    weddingDate: new Date(),
    time: new Date(),
    location: "",
    venue: "",
    guestCount: 0,
    dressCode: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({
    brideName: "",
    groomName: "",
    location: "",
    venue: "",
    guestCount: "",
    dressCode: "",
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({
        ...formData,
        weddingDate: selectedDate,
      });
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setFormData({
        ...formData,
        time: selectedTime,
      });
    }
  };

  const validateStep = (): boolean => {
    let isValid = true;
    const newErrors = { ...errors };

    switch (currentStep) {
      case STEPS.COUPLE_NAMES:
        if (!formData.brideName.trim()) {
          newErrors.brideName = "Bride name is required";
          isValid = false;
        }
        if (!formData.groomName.trim()) {
          newErrors.groomName = "Groom name is required";
          isValid = false;
        }
        break;

      case STEPS.LOCATION:
        if (!formData.location.trim()) {
          newErrors.location = "City/region is required";
          isValid = false;
        }
        if (!formData.venue.trim()) {
          newErrors.venue = "Venue name is required";
          isValid = false;
        }
        break;

      case STEPS.GUESTS_CODE:
        if (isNaN(Number(formData.guestCount))) {
          newErrors.guestCount = "Please enter a valid number";
          isValid = false;
        }
        if (!formData.dressCode.trim()) {
          newErrors.dressCode = "Dress code is required";
          isValid = false;
        }
        break;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < STEPS.SUMMARY) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(
        `${baseUrl}/weddingDetails/wedding-details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...formData,
            weddingDate: formData.weddingDate.toISOString().split("T")[0],
            time: formData.time.toISOString().split("T")[1].split(".")[0],
          }),
        }
      );

      setLoading(false);

      const data = await response.json();

      if (response.ok) {
        router.push("/(tabs)/home");
      } else {
        console.log("Login error:", data);
        throw new Error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error submitting wedding details:", error);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: Date): string => {
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderProgress = () => {
    return (
      <View style={styles.progressContainer}>
        {Object.values(STEPS).map((step, index) => {
          if (typeof step === "string") return null;

          return (
            <View
              key={index}
              style={[
                styles.progressDot,
                currentStep >= step ? styles.progressDotActive : {},
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.COUPLE_NAMES:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Let's get started!</Text>
            <Text style={styles.stepDescription}>
              First, tell us about the happy couple.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bride's Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter bride's name"
                placeholderTextColor="#888"
                value={formData.brideName}
                onChangeText={(text) => updateField("brideName", text)}
              />
              {errors.brideName ? (
                <Text style={styles.errorText}>{errors.brideName}</Text>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Groom's Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter groom's name"
                placeholderTextColor="#888"
                value={formData.groomName}
                onChangeText={(text) => updateField("groomName", text)}
              />
              {errors.groomName ? (
                <Text style={styles.errorText}>{errors.groomName}</Text>
              ) : null}
            </View>
          </View>
        );

      case STEPS.DATE_TIME:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>When is the big day?</Text>
            <Text style={styles.stepDescription}>
              Let us know the date and time of your wedding.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Wedding Date</Text>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateTimeText}>
                  {formatDate(formData.weddingDate)}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={formData.weddingDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Start Time</Text>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateTimeText}>
                  {formatTime(formData.time)}
                </Text>
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker
                  value={formData.time}
                  mode="time"
                  display="default"
                  onChange={onTimeChange}
                />
              )}
            </View>
          </View>
        );

      case STEPS.LOCATION:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Where is it happening?</Text>
            <Text style={styles.stepDescription}>
              Share the wedding location details.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>City/Region</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., San Francisco, CA"
                placeholderTextColor="#888"
                value={formData.location}
                onChangeText={(text) => updateField("location", text)}
              />
              {errors.location ? (
                <Text style={styles.errorText}>{errors.location}</Text>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Venue Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Grand Ballroom Hotel"
                placeholderTextColor="#888"
                value={formData.venue}
                onChangeText={(text) => updateField("venue", text)}
              />
              {errors.venue ? (
                <Text style={styles.errorText}>{errors.venue}</Text>
              ) : null}
            </View>
          </View>
        );

      case STEPS.GUESTS_CODE:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Final Details</Text>
            <Text style={styles.stepDescription}>
              Just a few more important details.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expected Number of Guests</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 150"
                placeholderTextColor="#888"
                value={formData.guestCount.toString()}
                onChangeText={(text) => updateField("guestCount", text)}
                keyboardType="number-pad"
              />
              {errors.guestCount ? (
                <Text style={styles.errorText}>{errors.guestCount}</Text>
              ) : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dress Code</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Formal, Cocktail, Beach Attire"
                placeholderTextColor="#888"
                value={formData.dressCode}
                onChangeText={(text) => updateField("dressCode", text)}
              />
              {errors.dressCode ? (
                <Text style={styles.errorText}>{errors.dressCode}</Text>
              ) : null}
            </View>
          </View>
        );

      case STEPS.SUMMARY:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Perfect! Here's a summary</Text>
            <Text style={styles.stepDescription}>
              Review your wedding details before continuing.
            </Text>

            <View style={styles.summaryCard}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Couple:</Text>
                <Text style={styles.summaryValue}>
                  {formData.brideName} & {formData.groomName}
                </Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Date & Time:</Text>
                <Text style={styles.summaryValue}>
                  {formatDate(formData.weddingDate)} at{" "}
                  {formatTime(formData.time)}
                </Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Location:</Text>
                <Text style={styles.summaryValue}>
                  {formData.venue}, {formData.location}
                </Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Guests:</Text>
                <Text style={styles.summaryValue}>{formData.guestCount}</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Dress Code:</Text>
                <Text style={styles.summaryValue}>{formData.dressCode}</Text>
              </View>
            </View>

            <Text style={styles.summaryNote}>
              You can always edit these details later in the app settings.
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {renderProgress()}
          {renderStepContent()}

          <View style={styles.buttonsContainer}>
            {currentStep > 0 && (
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.nextButton,
                currentStep === STEPS.SUMMARY ? styles.submitButton : {},
              ]}
              onPress={handleNext}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.nextButtonText}>
                  {currentStep === STEPS.SUMMARY ? "Complete" : "Continue"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 6,
  },
  progressDotActive: {
    backgroundColor: colorPalette.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  stepContent: {
    flex: 1,
    paddingVertical: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colorPalette.typographyPressed,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: colorPalette.typography,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: colorPalette.typography,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dateTimeButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dateTimeText: {
    fontSize: 16,
    color: colorPalette.typographyPressed,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: colorPalette.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  nextButton: {
    backgroundColor: colorPalette.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginLeft: 12,
  },
  submitButton: {
    backgroundColor: colorPalette.secondary,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: colorPalette.error,
    fontSize: 12,
    marginTop: 5,
  },
  summaryCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
  },
  summaryItem: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colorPalette.typography,
    width: "30%",
  },
  summaryValue: {
    fontSize: 16,
    color: colorPalette.typographyPressed,
    flex: 1,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  summaryNote: {
    fontSize: 14,
    color: colorPalette.typography,
    fontStyle: "italic",
    marginTop: 20,
    textAlign: "center",
  },
});
