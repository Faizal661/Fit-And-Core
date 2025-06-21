export interface FinanceData {
  totalRevenue: number;
  totalRefunds: number;
  netIncome: number;
  monthlyGrowth: number;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    refunds: number;
    netIncome: number;
  }>;
}