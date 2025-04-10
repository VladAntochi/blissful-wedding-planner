import { View, StyleSheet, Text } from "react-native";
import { TodoListPreview } from "../../modules/todo/components/TodoListPreview";
import { TimelinePreview } from "@/modules/timeline/components/TimelinePreview";
import { Spacer } from "@/modules/shared/components/Spacer";
import Screen from "@/modules/shared/components/Screen";
import { PlanningToolsCard } from "@/modules/shared/components/PlanningToolsCard";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTotalBudget,
  selectTotalSpent,
} from "@/modules/budgetPlanner/redux/budgetPlannerSelectors";
import {
  selectAllConfirmedGuests,
  selectAllGuests,
} from "@/modules/guests/redux/guestsSeclectors";
import { router } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppDispatch } from "@/redux/store";
import { fetchGuests } from "@/modules/guests/redux/guestsSlice";

export default function Tab() {
  const totalBudget = useSelector(selectTotalBudget);
  const totalSpent = useSelector(selectTotalSpent);
  const totalGuests = useSelector(selectAllGuests)?.length;
  const totalConfirmedGuests = useSelector(selectAllConfirmedGuests)?.length;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchChecklist = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        await dispatch(fetchGuests(token));
      }
    };

    fetchChecklist();
  }, [dispatch]);

  return (
    <Screen showBackButton={false}>
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", paddingVertical: 16 }}
      >
        <TodoListPreview />
        <View style={{ width: 8 }} />
        <TimelinePreview />
      </View>
      <Spacer size={24} />
      <Text style={styles.title}>Planning tools</Text>
      <Spacer size={12} />
      <PlanningToolsCard
        title={"Budget Tracker"}
        subtitle={`£${totalSpent} of £${totalBudget}`}
        icon="sterling-sign"
        onPress={() => router.push("/budgetScreen")}
      />
      <Spacer size={12} />
      <PlanningToolsCard
        title={"Guest List"}
        subtitle={`${totalGuests} guests (${totalConfirmedGuests} confirmed)`}
        icon="users"
        onPress={() => router.push("/guestsScreen")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: { fontSize: 20, color: "#333" },
});
