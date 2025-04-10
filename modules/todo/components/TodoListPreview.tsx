import { useSelector } from "react-redux";
import { selectAllTodos } from "../redux/todoSelectors";
import { router } from "expo-router";
import { PreviewCard } from "@/modules/shared/components/PreviewCard";

export const TodoListPreview = () => {
  const todos = useSelector(selectAllTodos);

  return (
    <PreviewCard
      title="Checklist"
      subtitle="Upcoming tasks"
      icon="list"
      data={todos.slice(0, 2)}
      onPress={() => router.push("/todoScreen")}
    />
  );
};
