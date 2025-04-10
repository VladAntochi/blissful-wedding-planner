import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
}

const Screen: React.FC<ScreenProps> = ({
  title,
  children,
  showBackButton = true,
}) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {showBackButton || title ? (
        <View style={styles.header}>
          {showBackButton && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color="#4C8056" />
            </TouchableOpacity>
          )}
          {title ? <Text style={styles.headerTitle}>{title}</Text> : null}
        </View>
      ) : null}

      {/* Screen Content */}
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F9F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E4E1",
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4C8056",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
});

export default Screen;
