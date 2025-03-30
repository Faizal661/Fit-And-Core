export interface IAdminRepository {
  docsCount(field: string, value: string): Promise<number>;
  docsCountForMonth(
    field: string,
    value: string,
    year: number,
    month: number
  ): Promise<number>;
  getMonthlySubscriptionData(): Promise<
    { name: string; users: number; trainers: number }[]
  >;
}
