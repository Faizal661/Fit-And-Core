
export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    user: {
      id: string;
      email: string;
      username: string;
    };
    accessToken: string;
    refreshToken: string;
  }
  