export interface IGoogleUser {
  id: string;
  email: string | undefined;
  displayName: string;
  profilePicture?: string;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ILoginResponse {
  user: { id: string; username: string; email: string; role: string };
  accessToken: string;
  refreshToken: string;
}

export interface IJwtDecoded {
  id: string;
  email: string;
  role: "user" | "trainer"|"admin",
  iat:number;
  exp:number;
}



