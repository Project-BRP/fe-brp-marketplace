export interface ILoginForm {
  email: string;
  password: string;
}

export interface IRegisterForm extends ILoginForm {
  name: string;
  confirmPassword: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IAuthResponse {
  status: string;
  resultCode: number;
  message: string;
}

export interface IRegisterData {
  email: string;
  name: string;
  password: string;
}

export interface IVerifEmail {
  token: string | string[];
}
