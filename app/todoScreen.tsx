import Screen from "@/modules/shared/components/Screen";
import TodoList from "../modules/todo/components/TodoList";

export default function TodoScreen() {
  return (
    <Screen showBackButton title="Checklist">
      <TodoList />
    </Screen>
  );
}
