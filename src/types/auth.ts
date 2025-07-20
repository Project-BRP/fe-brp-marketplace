import { User } from "./users";

export interface ILoginForm {
  email: string;
  password: string;
}

export type ILoginRequest = ILoginForm;

export interface IRegisterForm extends ILoginForm {
  name: string;
  confirmPassword: string;
}

export type IRegisterData = Omit<IRegisterForm, "confirmPassword">;

export interface IAuthResponse {
  status: string;
  resultCode: number;
  message: string;
}

export interface IVerifEmail {
  token: string | string[];
}

export interface IUpdateUserResponse extends Omit<IAuthResponse, "resultCode"> {
  data: Omit<User, "role">;
  code: number;
}

export type IUpdateUserData = Partial<Pick<User, "name">> & {
  oldPassword?: string;
  password?: string;
};
