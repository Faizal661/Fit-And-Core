import api from "../../config/axios.config";


export const fetchWalletData = async (page:number,limit:number,tab:string,startDate: string, endDate: string) => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        type: tab !== 'all' ? tab : '',
        startDate: startDate,
        endDate: endDate,
      });
    const response = await api.get(`/wallet?${params}`);
    return response.data.walletData;
};