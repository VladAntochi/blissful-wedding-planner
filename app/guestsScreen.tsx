import FloatingAddButton from "@/modules/budgetPlanner/components/AddButton";
import AddGuestModal from "@/modules/guests/components/AddGuestModal";
import {
  selectAllConfirmedGuests,
  selectAllDeclinedGuests,
  selectAllGuests,
} from "@/modules/guests/redux/guestsSeclectors";
import { Card } from "@/modules/shared/components/Card";
import { InfoCard } from "@/modules/shared/components/InfoCard";
import Screen from "@/modules/shared/components/Screen";
import { Spacer } from "@/modules/shared/components/Spacer";
import { colorPalette } from "@/modules/shared/theme";
import { capitalizeFirstLetter } from "@/modules/shared/utils";
import { AppDispatch } from "@/redux/store";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function GuestsScreen() {
  const guests = useSelector(selectAllGuests);
  const totalGuests = guests?.length;
  const totalConfirmedGuests = useSelector(selectAllConfirmedGuests)?.length;
  const totalDeclinedGuests = useSelector(selectAllDeclinedGuests)?.length;

  const [isModalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  const sortedGuests = [...guests]?.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );

  return (
    <Screen showBackButton title="Guests">
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <>
          <InfoCard
            title="Total invited"
            value={`${totalGuests}`}
            color={colorPalette.primary}
          />
          <Spacer size={8} orientation="row" />
        </>
        <>
          <InfoCard
            title="Confirmed"
            value={totalConfirmedGuests.toString()}
            color={colorPalette.primaryLight}
          />
          <Spacer size={8} orientation="row" />
        </>
        <>
          <InfoCard
            title="Declined"
            value={totalDeclinedGuests.toString()}
            color={colorPalette.error}
          />
          <Spacer size={8} orientation="row" />
        </>
      </View>
      <Spacer size={24} />
      {sortedGuests.map((guest) => {
        const { id, name, status } = guest;
        return (
          <View key={id + name}>
            <Card width={"100%"} key={id}>
              <View style={styles.progressRow}>
                <Text style={styles.sectionTitle}>{name}</Text>
                <Text
                  style={{
                    ...styles.status,
                    color:
                      status === "accepted"
                        ? colorPalette.primaryLight
                        : status === "invited"
                        ? colorPalette.secondary
                        : colorPalette.error,
                  }}
                >
                  {capitalizeFirstLetter(status)}
                </Text>
              </View>
            </Card>
            <Spacer size={8} />
          </View>
        );
      })}
      <FloatingAddButton onPress={handleOpenModal} />
      <AddGuestModal isVisible={isModalVisible} onClose={handleCloseModal} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  status: {
    fontSize: 14,
    fontWeight: "600",
  },
});
