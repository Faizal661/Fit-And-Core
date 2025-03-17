

export interface IAdminRepository {
    docsCount(field:string,value:string): Promise<number>;
}