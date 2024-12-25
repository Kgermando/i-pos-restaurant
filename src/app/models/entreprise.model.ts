import { IUser } from "../auth/models/user";
import { IPos } from "./pos.model";

export interface IEntreprise {
    ID?: number;
    id?: number;
    type_entreprise: string;
    name: string;
    code: number;
    rccm: string;
    idnat: string;
    email: string;                        // Email officiel
    telephone: string;
    manager: string;
    status: boolean;
    // total_compte: number;
    abonnement: Date;
    signature: string;
    Users: IUser[]
    Pos: IPos[]

    total_user: number;
    total_pos: number;

    created_at?: Date;
    updated_at?: Date;
}