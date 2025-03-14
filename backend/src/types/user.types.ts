export interface IUser {
    _id: string;
    username: string;
    email: string;
    password: string;
    isBlocked: Boolean;
    role: "user" | "trainer"|"admin";
    profilePicture?: string;
    dateOfBirth: Date;
    createdAt: Date;
    updatedAt: Date;
} 


export interface jwtDecoded{
    id:string,
    email:string,
    role:"user" | "trainer"|"admin",
    iat:number,
    exp:number

}