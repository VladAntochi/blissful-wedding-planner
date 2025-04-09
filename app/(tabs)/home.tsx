import { View, StyleSheet, ScrollView, ImageBackground } from "react-native";
import { colorPalette } from "../../modules/shared/theme";
import { FontAwesome } from "@expo/vector-icons";
import WeddingCountdown from "../../modules/todo/components/WeddingCountdown";
import WeddingDetails from "../../modules/todo/components/WeddingDetails";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "../../modules/todo/components/Avatar";
import { PlanningProgress } from "../../modules/todo/components/ProgressBar";
import { Spacer } from "../../modules/shared/components/Spacer";
import { useDispatch, useSelector } from "react-redux";
import { selectCompletionPercentage } from "../../modules/todo/redux/todoSelectors";
import { selectWeddingDetails } from "@/modules/weddingDetails/redux/weddingDetailsSelectors";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchWeddingDetails } from "@/modules/weddingDetails/redux/weddingDetailsSlice";
import { AppDispatch } from "@/redux/store";

export default function Tab() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();

  const tasksProgress = useSelector(selectCompletionPercentage);
  const weddingDetails = useSelector(selectWeddingDetails);
  const { location, time, guestCount, dressCode, brideName, groomName } =
    weddingDetails;

  useEffect(() => {
    const fetchDetails = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        await dispatch(fetchWeddingDetails(token));
      }
    };

    fetchDetails();
  }, [dispatch]);

  return (
    <ScrollView
      contentContainerStyle={{
        ...styles.container,
        paddingBottom: insets.bottom + 100,
      }}
    >
      <ImageBackground
        source={require("../../assets/images/background-splash.png")}
        style={styles.header}
        blurRadius={3}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <Spacer size={insets.top} />
        <View style={styles.profilePicturesContainer}>
          <Avatar name={groomName} variant="groom" />
          <FontAwesome
            size={28}
            name="heart"
            color={colorPalette.secondary}
            style={{ paddingHorizontal: 24 }}
          />
          <Avatar name={brideName} />
        </View>
      </ImageBackground>
      <View style={{ alignItems: "center" }}>
        <WeddingCountdown />
        <Spacer size={12} />
        <PlanningProgress progressPercentage={tasksProgress} />
        <Spacer size={12} />
        <WeddingDetails
          location={location}
          time={time}
          guestCount={guestCount}
          dressCode={dressCode}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  profilePicturesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 0,
  },
});
