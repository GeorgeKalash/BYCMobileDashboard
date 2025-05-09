import { format } from "date-fns";

/**
 * Safely formats a date using a given format string.
 * @param value - The date value (string | number | Date).
 * @param formatString - The format string according to date-fns.
 * @returns Formatted date string or original value if invalid.
 */
const formatDate = (
  value: string | number | Date | null | undefined,
  formatString: string
): string => {
  if (!value) return "";

  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) throw new Error("Invalid date");
    return format(date, formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return String(value); // fallback to string representation
  }
};

export default formatDate;
