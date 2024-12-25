import { IEntreprise } from "../../models/entreprise.model";
import { IPos } from "../../models/pos.model";

export interface IUser {
  ID?: number;
  fullname: string;
  email: string;
  telephone: string;
  password: string;
  password_confirm: string;
  role: string;
  permission: string;
  status: boolean;
  currency: string;
  entreprise_id: number;
  entreprise?: IEntreprise;
  pos_id?: number;
  pos?: IPos;
  signature: string;
  created_at?: Date;
  updated_at?: Date;
}


export interface Login {
  email: string;
  password: string;
}

// login-error.interface.ts ==> Please, adapt to your actual backend response shape
export interface LoginError {
  code: number;
  message: string;
}

// login-success.interface.ts ==> Please, adapt to your actual backend response shape
export interface LoginSuccess {
  token: string;
  refresh_token: string;
}


export type LoginResponse = LoginSuccess | LoginError;
