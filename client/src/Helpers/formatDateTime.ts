import { format } from "date-fns";

export const formatDateTime = (value: string | Date | undefined | null) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return format(d, "MM/dd/yy h:mm a");
};