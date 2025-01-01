import { ILivraison } from "./livraison.model";

export interface ILivreur {
    ID?: number;
    name_society: string;
    livreur_name: string;
    telephone: string;
    email: string;
    rccm: string;
    idnat: string;
    signature: string;
    code_entreprise: number;
    Livraison?: ILivraison[]
}