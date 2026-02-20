export const truncate = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
};

export const formatJournalDate = (ms: number, hour12: boolean = true): string => {
  const date = new Date(ms);
  const now = new Date();

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  const timeString = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12 });

  if (isToday) return `Today at ${timeString}`;
  if (isYesterday) return `Yesterday at ${timeString}`;

  const dateString = date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

  return `${dateString} at ${timeString}`;
};
