// Types
export interface UserProfile {
  username: string;
  profilePicture?: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pinCode: string;
  joinedDate: string;
}

export interface UpdateProfileData {
  gender: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pinCode: string;
}
