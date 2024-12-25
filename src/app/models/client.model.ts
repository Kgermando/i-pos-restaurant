import { ICommande } from "./commande.model";

export interface IClient {
    ID?: number; 
    created_at?: Date;
    updated_at?: Date;
    fullname: string;
    telephone: string;
    email?: string; 
    signature: string; // Code secret pour le client
    code_entreprise?: number;
    commandes? :ICommande[];
}
