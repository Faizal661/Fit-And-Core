export interface IAdminRepository {
  docsCount(field: string, value: string): Promise<number>;
  getMonthlySubscriptionData(): Promise<
    { name: string; users: number; trainers: number }[]
  >;
}
