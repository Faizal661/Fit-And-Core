
export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    user: {
      id: string;
      email: string;
      username: string;
      role:string;
    };
    accessToken: string;
  }
  