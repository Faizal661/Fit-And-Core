export interface IUser {
    _id: string;
    username: string;
    email: string;
    password: string;
    isBlocked: Boolean;
    role: "user" | "trainer";
    profilePicture?: string;
    dateOfBirth: Date;
    createdAt: Date;
    updatedAt: Date;
} 