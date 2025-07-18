import { Skeleton } from "@mui/material";
import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react";

export const MetricCard = ({
  title,
  totalValue,
  currentMonthValue,
  change,
  icon: Icon,
  isLoading,
  isError,
  iconClasses,
  cardClasses,
}: {
  title: string;
  totalValue: string;
  currentMonthValue: string;
  change: number;
  icon: LucideIcon;
  isLoading: boolean;
  isError: Error | null;
  iconClasses: string;
  cardClasses: string;
}) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br rounded-full -mr-10 -mt-10 ${cardClasses}`}></div>

      <div className="relative z-10">
        {/* Header with icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-600">
            {Icon && (
              <div
                className={`w-12 h-12 bg-gradient-to-br  rounded-full flex items-center justify-center mb-4 ${iconClasses}`}
              >
                <Icon className="text-white" size={18} />
              </div>
            )}
            <span>{title}</span>
          </div>

          {!isLoading && !isError && (
            <div
              className={`px-2 py-1 text-xs font-medium rounded-full flex items-center
                  ${
                    isPositive
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                  }`}
            >
              {isPositive ? (
                <ArrowUp size={12} className="mr-1" />
              ) : (
                <ArrowDown size={12} className="mr-1" />
              )}
              {Math.abs(change || 0)}%
            </div>
          )}
        </div>

        {isError ? (
          <div className="text-gray-700 text-lg py-4 text-center bg-red-50 rounded-lg">
            Failed to fetch data.
          </div>
        ) : (
          <div>
            <div className="text-3xl font-bold mb-2 text-gray-800 tracking-tight">
              {isLoading ? (
                <Skeleton width={80} animation="wave" />
              ) : (
                totalValue
              )}
            </div>

            {currentMonthValue !== undefined && (
              <div className="text-sm text-gray-500 mb-3 flex items-center">
                <span className="mr-2">This Month:</span>
                {isLoading ? (
                  <Skeleton width={50} />
                ) : (
                  <span className="font-medium text-gray-700">
                    {currentMonthValue}
                  </span>
                )}
              </div>
            )}

            {!isLoading && (
              <div
                className={`flex items-center text-sm mt-2 font-medium ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositive ? (
                  <ArrowUp size={12} className="mr-1" />
                ) : (
                  <ArrowDown size={12} className="mr-1" />
                )}
                <span>{Math.abs(change || 0)}% </span>
                <span className="font-normal text-gray-500 ml-1">
                  {isPositive ? "increase" : "decrease"} from last month
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
