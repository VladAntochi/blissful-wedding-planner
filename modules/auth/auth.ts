import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../shared/utils";

export const login = async (email: string, password: string): Promise<void> => {
  try {
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      await AsyncStorage.setItem("authToken", data.token);
      console.log("Logged in!");
    } else {
      console.log("Login error:", data);
      throw new Error(data.error || "Login failed");
    }
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem("authToken");
  const token = await AsyncStorage.getItem("authToken");
  console.log("Logged out!", token);
};

export const register = async (email: string, password: string) => {
  try {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Registration failed");
    }

    console.log("✅ Registered:", data);
    return data;
  } catch (err: any) {
    console.error("❌ Register error:", err);
    throw err;
  }
};
