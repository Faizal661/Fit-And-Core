import api from "../../config/axios.config";


export const fetchFinanceData = async (startDate: string, endDate: string) => {
    const params = new URLSearchParams({
        startDate,
        endDate,
    });
    const response = await api.get(`/admin/finance/analytics?${params}`);
    return response.data.financeData;
};