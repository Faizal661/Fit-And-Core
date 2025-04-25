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
        <div className="bg-white p-5 rounded-md shadow-sm border border-gray-100"> 
            <div className="flex items-center mb-3 text-sm text-gray-500"> 
                {Icon && <Icon size={16} className="mr-2 text-gray-400" />} 
                <span className="font-medium">{title}</span> 
            </div>
            {isError ? (
                <div className="text-gray-700 text-lg my-4">Failed to fetch data.</div>
            ) : (
                <div>
                    <div className="text-2xl font-semibold mb-1 text-gray-800"> 
                        {isLoading ? (
                            <Skeleton width={40} animation="wave" /> 
                        ) : (
                            totalValue
                        )}
                    </div>
                    {currentMonthValue !== undefined && (
                        <div className="text-sm text-gray-600 mb-3"> 
                            This Month: {isLoading ? <Skeleton width={50} /> : currentMonthValue}
                        </div>
                    )}
                    <div className={`flex items-center text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}> 
                        {isLoading ? (
                            <Skeleton width={120} /> 
                        ) : (
                            <>
                                {isPositive ? (
                                    <ArrowUp size={12} className="mr-1" /> 
                                ) : (
                                    <ArrowDown size={12} className="mr-1" /> 
                                )}
                                {Math.abs(change || 0)}%&nbsp;<span className="font-normal lowercase">{isPositive ? "increase" : "decrease"}</span>&nbsp;from last month 
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
  