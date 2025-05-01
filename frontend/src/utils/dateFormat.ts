// Date 2025-04-08T05:12:27.915Z => 2025-04-08
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

// Date 2025-04-08T05:12:27.915Z => Apr 8,2025
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};


export const formatDateForQuery = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; 
  const day = date.getDate();

  const paddedMonth = month < 10 ? `0${month}` : `${month}`;
  const paddedDay = day < 10 ? `0${day}` : `${day}`;

  const formattedDate = `${year}-${paddedMonth}-${paddedDay}`;

  console.log("🚀 ~ formatDateForQuery (Local) ~ original date object:", date);
  console.log("🚀 ~ formatDateForQuery (Local) ~ formatted string:", formattedDate);

  return formattedDate;
};