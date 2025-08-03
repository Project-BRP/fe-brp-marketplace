import { User } from "./users";

export interface ILoginForm {
  email: string;
  password: string;
}

export type ILoginRequest = ILoginForm;

export interface IRegisterForm extends ILoginForm {
  name: string;
  phoneNumber: string;
  confirmPassword: string;
}

export type IRegisterData = Omit<IRegisterForm, "confirmPassword">;

export interface IAuthResponse {
  status: string;
  code: number;
  message: string;
}

export interface IVerifEmail {
  token: string | string[];
}

export interface IUpdateUserResponse extends Omit<IAuthResponse, "resultCode"> {
  data: Omit<User, "role">;
  code: number;
}

export type IUpdateUserData =
  | { name: string }
  | { phoneNumber: string }
  | { oldPassword: string; password: string }
  | { image: FormData };

export interface IForgotPasswordForm {
  email: string;
}

export interface IResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export interface IResetPasswordVariable extends IResetPasswordForm {
  token: string;
}
