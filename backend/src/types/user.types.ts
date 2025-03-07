export interface IUser {
    _id: string;
    username: string;
    email: string;
    password: string;
    status: "active" | "blocked";
    role: "user" | "trainer";
    profilePicture?: string;
    resume?: string;
    dateOfBirth: Date;
    createdAt: Date;
    updatedAt: Date;
} 