export interface IUser {
    _id: string;
    username: string;
    email: string;
    password?: string;
    isBlocked: Boolean;
    role: "user" | "trainer"|"admin";
    profilePicture: string;
    googleId?:string;
    dateOfBirth?: Date;
    gender?:string,
    phone?: string | undefined;
    address?: string | undefined;
    city?: string | undefined;
    pinCode?: string | undefined;
    createdAt: Date;
    updatedAt: Date;
} 

export interface IUserProfile {
    username: string;
    email: string;
    profilePicture?: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: Date;
    address?: string;
    city?: string;
    pinCode?: string;
    joinedDate: Date;
  }
  
  export interface UserProfileUpdateData {
    username?: string;
    email?: string;
    password?: string;
    profilePicture?: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: Date;
    address?: string;
    city?: string;
    pinCode?: string;
  }