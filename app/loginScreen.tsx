import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { colorPalette } from "@/modules/shared/theme";
import { login } from "@/modules/auth/auth";
import { useDispatch } from "react-redux";
import { updateEmail } from "@/modules/auth/redux/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchWeddingDetails } from "@/modules/weddingDetails/redux/weddingDetailsSlice";
import { AppDispatch } from "@/redux/store";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  const validateForm = () => {
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!password.trim()) {
      setError("Password is required");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      await login(email, password);
      setLoading(false);
      dispatch(updateEmail(email));
      const token = await AsyncStorage.getItem("authToken");

      if (token) {
        const response = await dispatch(fetchWeddingDetails(token));

        if (fetchWeddingDetails.rejected.match(response)) {
          router.navigate("/onboardingScreen");
        } else {
          router.navigate("/home");
        }
      }
    } catch (err) {
      setLoading(false);
      setError("Login failed. Please check your credentials.");
    }
  };

  const navigateToRegister = () => {
    router.push("/registerScreen");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ImageBackground
          source={require("../assets/images/background-splash.png")}
          style={styles.header}
          blurRadius={3}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
        </ImageBackground>

        <View style={styles.formContainer}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Your password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Log In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={styles.registerButton}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: colorPalette.primary,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    height: 300,
  },
  logo: {
    width: 150,
    height: 150,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Adjust opacity here
    zIndex: 0,
  },
  logoContainer: {
    position: "absolute",
    top: 100,
    alignItems: "center",
  },
  logoInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colorPalette.secondary,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colorPalette.secondary,
    opacity: 0.9,
  },
  formContainer: {
    padding: 24,
    flex: 1,
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
  button: {
    backgroundColor: colorPalette.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPassword: {
    alignItems: "center",
    marginTop: 20,
  },
  forgotPasswordText: {
    color: colorPalette.primary,
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  registerText: {
    color: colorPalette.typography,
    fontSize: 14,
  },
  registerButton: {
    color: colorPalette.primary,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  errorText: {
    color: colorPalette.error,
    fontSize: 14,
    marginBottom: 15,
    textAlign: "center",
  },
});
