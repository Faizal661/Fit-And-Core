import { getBMIClass } from "../../../utils/getBmiClass";

export const BmiCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload; // Access the full data point
      const bmiDetails = getBMIClass(data.bmi);
  
      // Format date for display if 'label' (XAxis dataKey value) is a timestamp
      const displayDate = new Date(label).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
  
      return (
        <div className="bg-white p-3 shadow-lg rounded-md border border-gray-200">
          <p className="text-sm text-gray-500">{`Date: ${displayDate}`}</p>
          <p className="font-semibold" style={{ color: bmiDetails.color }}>
            {`BMI: ${data.bmi.toFixed(2)} (${bmiDetails.class})`}
          </p>
          <p className="text-sm text-gray-700">{`Weight: ${data.weight} kg`}</p>
          <p className="text-sm text-gray-700">{`Height: ${data.height} cm`}</p>
        </div>
      );
    }
    return null;
  };