import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Screen from "@/modules/shared/components/Screen";
import { useSelector } from "react-redux";
import { selectAllToDosWithDueDate } from "@/modules/todo/redux/todoSelectors";
import {
  format,
  addDays,
  addMonths,
  startOfDay,
  endOfDay,
  isWithinInterval,
} from "date-fns";
import { ToDoItem } from "@/modules/todo/redux/todoSlice";

const TimelineScreen = () => {
  const allEvents = useSelector(selectAllToDosWithDueDate);

  // Set up date ranges with precise start/end times for accurate filtering
  const now = new Date();
  const today = startOfDay(now);
  const tomorrow = startOfDay(addDays(today, 1));
  const dayAfterTomorrow = startOfDay(addDays(today, 2));
  const nextWeekEnd = endOfDay(addDays(today, 7));
  const nextMonthEnd = endOfDay(addMonths(today, 1));

  // Filter events by date ranges
  const todayEvents = allEvents.filter((event) => {
    if (!event.dueDate) return false;
    const eventDate = new Date(event.dueDate);
    return isWithinInterval(eventDate, {
      start: startOfDay(today),
      end: endOfDay(today),
    });
  });

  const tomorrowEvents = allEvents.filter((event) => {
    if (!event.dueDate) return false;
    const eventDate = new Date(event.dueDate);
    return isWithinInterval(eventDate, {
      start: startOfDay(tomorrow),
      end: endOfDay(tomorrow),
    });
  });

  const nextWeekEvents = allEvents
    .filter((event) => {
      if (!event.dueDate) return false;
      const eventDate = new Date(event.dueDate);
      return isWithinInterval(eventDate, {
        start: startOfDay(dayAfterTomorrow),
        end: nextWeekEnd,
      });
    })
    .sort((a, b) => {
      return new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime();
    });

  const nextMonthEvents = allEvents
    .filter((event) => {
      if (!event.dueDate) return false;
      const eventDate = new Date(event.dueDate);
      return isWithinInterval(eventDate, {
        start: addDays(nextWeekEnd, 1),
        end: nextMonthEnd,
      });
    })
    .sort((a, b) => {
      return new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime();
    });

  const upcomingEvents = allEvents
    .filter((event) => {
      if (!event.dueDate) return false;
      const eventDate = new Date(event.dueDate);
      return eventDate > nextMonthEnd;
    })
    .sort((a, b) => {
      return new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime();
    });

  const renderTimelineCard = ({
    name,
    showDate,
    dueDate,
  }: {
    name: string;
    showDate?: boolean;
    dueDate?: string;
  }) => {
    const formattedDueDate = dueDate
      ? format(new Date(dueDate), "dd/MM/yyyy")
      : undefined;

    return (
      <View style={styles.eventCard} key={name + (formattedDueDate || "")}>
        <View style={styles.eventDetails}>
          <Text style={styles.eventName}>{name}</Text>
        </View>
        {showDate && formattedDueDate && (
          <Text style={styles.dueDate}>{formattedDueDate}</Text>
        )}
      </View>
    );
  };

  // Helper function to render a section if it has events
  const renderSection = (
    title: string,
    events: ToDoItem[],
    showDates = false
  ) => {
    if (!events || events.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionTitleContainer}>
          <View style={styles.timelineDot} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.eventsContainer}>
          {events.map((event) =>
            renderTimelineCard({
              name: event.title,
              showDate: showDates,
              dueDate: event.dueDate,
            })
          )}
        </View>
      </View>
    );
  };

  return (
    <Screen showBackButton title="Timeline">
      <View style={styles.timelineContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.timelineLineContainer}>
            <View style={styles.timelineLine} />

            {renderSection("Today", todayEvents)}
            {renderSection("Tomorrow", tomorrowEvents)}
            {renderSection("Next Week", nextWeekEvents, true)}
            {renderSection("Next Month", nextMonthEvents, true)}
            {renderSection("Upcoming", upcomingEvents, true)}

            {!todayEvents.length &&
              !tomorrowEvents.length &&
              !nextWeekEvents.length &&
              !nextMonthEvents.length &&
              !upcomingEvents.length && (
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.emptyStateText}>No upcoming events</Text>
                </View>
              )}
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F9F7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E4E1",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E4C38",
  },
  title: { fontSize: 20, color: "#333" },
  timelineContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  timelineLineContainer: {
    position: "relative",
    paddingHorizontal: 16,
  },
  timelineLine: {
    position: "absolute",
    top: 28,
    bottom: 0,
    left: 20,
    width: 2,
    backgroundColor: "#E0E4E1",
  },
  sectionContainer: {
    marginTop: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#4C8056",
    marginRight: 12,
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    color: "#4C8056",
    fontWeight: "500",
  },
  eventsContainer: {
    paddingLeft: 40,
  },
  eventCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  eventTime: {
    justifyContent: "center",
    marginRight: 12,
  },
  eventTimeText: {
    fontSize: 12,
    color: "#4C8056",
    fontWeight: "500",
  },
  eventDetails: {
    flex: 1,
  },
  eventName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E4C38",
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  emptyStateContainer: {
    alignItems: "center",
    marginTop: 40,
    paddingLeft: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#9CA3AF",
  },
});

export default TimelineScreen;
