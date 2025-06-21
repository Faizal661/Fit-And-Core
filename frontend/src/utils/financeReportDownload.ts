import * as XLSX from "xlsx";
import { FinanceData } from "../pages/shared/FinanceManagementPage";

export const exportFinanceReport = (financeData:FinanceData) => {

  const { totalRevenue, totalRefunds, netIncome, monthlyGrowth, revenueByMonth } = financeData;

  // 1. Summary Sheet
  const summaryData = [
    ["Metric", "Value"],
    ["Total Revenue", totalRevenue],
    ["Total Refunds", totalRefunds],
    ["Net Income", netIncome],
    ["Monthly Growth (%)", monthlyGrowth],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

  // 2. Monthly Data Sheet
  const monthlyData = [
    ["Month", "Revenue", "Refunds", "Net Income"],
    ...revenueByMonth.map(({ month, revenue, refunds, netIncome }) => [
      month,
      revenue,
      refunds,
      netIncome,
    ]),
  ];

  const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyData);

  // Create Workbook and Add Sheets
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
  XLSX.utils.book_append_sheet(workbook, monthlySheet, "Monthly Report");

  // Export to .xlsx
  XLSX.writeFile(workbook, "finance_report.xlsx");
};
