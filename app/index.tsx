import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          router.push("/(tabs)/home");
        } else {
          router.push("/welcomeScreen");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        router.push("/welcomeScreen");
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [router]);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopFade = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    loopFade.start();

    return () => loopFade.stop(); // Optional cleanup
  }, [fadeAnim]);

  return (
    <ImageBackground
      source={require("../assets/images/background-splash.png")}
      style={styles.backgroundImage}
      blurRadius={3}
    >
      <View style={styles.logoContainer}>
        <Animated.Image
          source={require("../assets/images/infinity-logo.png")}
          style={[styles.logo, { opacity: fadeAnim }]}
          resizeMode="contain"
        />
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    position: "absolute",
    top: 40,
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
