// Date 2025-04-08T05:12:27.915Z => 2025-04-08
export const formatDateForInput = (
  dateString: string | undefined | Date
): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

// Date 2025-04-08T05:12:27.915Z => Apr 8,2025
export const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Date 2025-04-08T05:12:27.915Z => Apr 8,2025 , 02:16 PM
export const formatDateAndTime = (dateString: string | Date) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
