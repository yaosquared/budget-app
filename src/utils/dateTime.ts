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

export const toISODate = (d: Date) => {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const parseISODate = (value: string): Date | null => {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return isNaN(d.getTime()) ? null : d;
};

export const getCalendarDays = (year: number, month: number) => {
  const first = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: { date: Date; inMonth: boolean }[] = [];

  for (let i = first - 1; i >= 0; i--) {
    cells.push({
      date: new Date(year, month - 1, daysInPrev - i),
      inMonth: false,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true });
  }

  let t = 1;
  while (cells.length < 42) {
    cells.push({ date: new Date(year, month + 1, t++), inMonth: false });
  }

  return cells;
};

export const to12Hour = (hour24: number) => {
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour, period };
};

export const to24Hour = (hour12: number, period: string) => {
  let h = hour12;

  if (period === "AM") {
    if (h === 12) h = 0;
  } else {
    if (h !== 12) h += 12;
  }

  return h;
};

export const getStartOfToday = (): Date => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};
