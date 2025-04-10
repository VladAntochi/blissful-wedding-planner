// app/welcome/index.tsx
import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { colorPalette } from "@/modules/shared/theme";
import { Spacer } from "@/modules/shared/components/Spacer";

export default function WelcomeScreen() {
  const router = useRouter();

  const handleLoginNavigation = () => {
    // router.push("/login"); // Navigate to login screen
  };

  const handleOnLoginPress = () => {
    router.push("/loginScreen");
  };

  const handleOnRegisterPress = () => {
    router.push("/registerScreen");
  };

  return (
    <ImageBackground
      source={require("../assets/images/background-splash.png")}
      style={styles.backgroundImage}
      blurRadius={3}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/infinity-logo.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.buttonContainer,
            { backgroundColor: colorPalette.secondary },
          ]}
          onPress={handleOnLoginPress}
        >
          <Text style={styles.buttonText}>{"Login"}</Text>
        </TouchableOpacity>
        <Spacer size={12} />

        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.buttonContainer,
            { backgroundColor: colorPalette.primary },
          ]}
          onPress={handleOnRegisterPress}
        >
          <Text style={styles.buttonText}>{"Register"}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonsContainer: {
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
  },
  logoContainer: {
    position: "absolute",
    top: 40,
    alignItems: "center",
  },
});
