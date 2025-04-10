import { colorPalette } from "@/modules/shared/theme";

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import { selectEmail } from "@/modules/auth/redux/authSelectors";
import { logout } from "@/modules/auth/auth";

export default function Tab() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const userEmail = useSelector(selectEmail);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => {
          setLoading(true);
          logout();
          setLoading(false);
          router.push("/loginScreen");
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.contentContainer}>
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Your Account</Text>
          <View style={styles.emailContainer}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.emailText}>{userEmail}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.logoutButtonText}>Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  profileSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colorPalette.typographyPressed,
    marginBottom: 16,
  },
  emailContainer: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    color: colorPalette.typography,
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    color: colorPalette.typographyPressed,
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: colorPalette.primary,
    borderRadius: 8,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
