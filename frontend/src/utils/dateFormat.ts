
export const formatDateForInput = (dateString: string | undefined): string => {
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
