export const formatDate = (value, options) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(
    "en-US",
    options || { month: "short", year: "numeric" },
  );
};

export const formatDateRange = (start, end, isCurrent) => {
  const startLabel = formatDate(start);
  if (isCurrent) return `${startLabel} — Present`;
  const endLabel = end ? formatDate(end) : "Present";
  return `${startLabel} — ${endLabel}`;
};

export const truncate = (text, length = 160) => {
  if (!text) return "";
  return text.length > length ? `${text.slice(0, length).trim()}…` : text;
};

export const initials = (name = "") =>
  name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
