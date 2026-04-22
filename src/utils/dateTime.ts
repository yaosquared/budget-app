export const formatDate = (dateTime: string) => {
  if (!dateTime) return "-";

  const date = new Date(dateTime);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
};

export const formatTime = (dateTime: string) => {
  if (!dateTime) return "-";

  const timeMatch = dateTime.match(/^(\d{2}):(\d{2})(?::\d{2})?$/);
  if (timeMatch) {
    let hours = Number(timeMatch[1]);
    const minutes = timeMatch[2];

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${ampm}`;
  }

  const date = new Date(dateTime);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleTimeString("en-US");
};

export const formatDateTime = (dateTime: string) => {
  if (!dateTime) return "-";

  const date = new Date(dateTime);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
