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
  }: {
    title: string;
    totalValue: string;
    currentMonthValue: string;
    change: number;
    icon: LucideIcon;
    isLoading: boolean;
    isError: Error | null;
  }) => {
    const isPositive = change >= 0;
  
    return (
      <div className="bg-white p-4 flex flex-col border-1">
        <div className="text-xs text-gray-400 mb-2 flex items-center">
          {Icon && <Icon size={14} className="mr-2" />}
          {title}
        </div>
        {isError ? (
          <div className="text-gray-800 text-lg my-4">Failed to fetch data.</div> 
        ) : (
          <div>
            <div className="text-xl font-medium mb-2">
              {isLoading ? (
                <Skeleton width={30} animation="wave" />
              ) : (
                totalValue
              )}
            </div>
            {currentMonthValue !== undefined && (
              <div className="text-xs text-gray-500 mb-2">
                This Month: {isLoading ? <Skeleton width={40} /> : currentMonthValue}
              </div>
            )}
            <div className={`text-xs ${isPositive ? "text-green-500" : "text-red-500"} flex items-center`}>
              {isLoading ? (
                <Skeleton width={150} />
              ) : (
                <>
                  {isPositive ? (
                    <ArrowUp size={10} className="mr-1" />
                  ) : (
                    <ArrowDown size={10} className="mr-1" />
                  )}
                  {Math.abs(change || 0)}% {isPositive ? "increase" : "decrease"} from last month
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
    };
  