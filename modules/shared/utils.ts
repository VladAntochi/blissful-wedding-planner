export const calculateToDoDueDate = (dueDate: Date) => {
  const today = new Date();
  const diff = dueDate.getTime() - today.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return `${Math.abs(days)} overdue`;
  } else if (days === 0) {
    return "Today";
  } else if (days === 1) {
    return "Tomorrow";
  } else {
    return `Due in ${days} days`;
  }
};

export const capitalizeFirstLetter = (word: string) => {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const baseUrl = "http://192.168.1.69:3000";
