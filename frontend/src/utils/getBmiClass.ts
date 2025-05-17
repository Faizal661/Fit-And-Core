export const getBMIClass = (bmi: number) => {
  if (bmi < 18.5)
    return { class: "Underweight", color: "text-blue-600", range: "< 18.5" };
  if (bmi < 25)
    return { class: "Normal", color: "text-green-600", range: "18.5 - 24.9" };
  if (bmi < 30)
    return {
      class: "Overweight",
      color: "text-yellow-600",
      range: "25 - 29.9",
    };
  return { class: "Obese", color: "text-red-600", range: "≥ 30" };
};
