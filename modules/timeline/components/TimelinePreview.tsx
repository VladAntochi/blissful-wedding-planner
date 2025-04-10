import { useSelector } from "react-redux";
import { PreviewCard } from "@/modules/shared/components/PreviewCard";
import { router } from "expo-router";
import { selectAllToDosWithDueDate } from "@/modules/todo/redux/todoSelectors";

export const TimelinePreview = () => {
  const upcomingEvents = useSelector(selectAllToDosWithDueDate);

  return (
    <PreviewCard
      title="Timeline"
      subtitle="Upcoming events"
      icon="calendar"
      data={upcomingEvents}
      onPress={() => router.push("/timelineScreen")}
    />
  );
};

export default TimelinePreview;
