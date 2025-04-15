export interface IUser {
    _id: string;
    username: string;
    email: string;
    password?: string;
    isBlocked: boolean;
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

  export interface AllUsersData {
    users: {
      _id: string;
      username: string;
      profilePicture: string;
      email: string;
      isBlocked: boolean;
      createdAt: Date;
    }[];
    total: number;
  }