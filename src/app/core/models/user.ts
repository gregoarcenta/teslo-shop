export interface IAuthUser {
  user: IUser;
  accessToken: string;
}

export interface IUser {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  roles: string[];
}
