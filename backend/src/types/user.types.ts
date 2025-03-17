export interface IUser {
    _id: string;
    username: string;
    email: string;
    password: string;
    isBlocked: Boolean;
    role: "user" | "trainer"|"admin";
    profilePicture?: string;
    googleId?:string;
    dateOfBirth: Date;
    gender?:string,
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

export interface IUserProfile {
    username: string;
    profilePicture?: string;
    gender?: string;
    dateOfBirth?: Date;
    phone?: string;
    email: string;
    address?: string;
    city?: string;
    pinCode?: string;
    joinedDate: Date;
  }
  
  export interface UserProfileUpdateData {
    gender?: string;
    dateOfBirth?: Date;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    pinCode?: string;
    profilePicture?: string;
    username?: string;
    password?: string;
  }