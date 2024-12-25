import { ICommande } from "./commande.model";
import { IPos } from "./pos.model";

export interface ITableBox {
    ID?: number;
    pos_id?: number;
    Pos? : IPos;
    name: string;
    numero: number;
    status: string;  // Libre et Fermée
    signature: string;
    code_entreprise?: number;
    Commandes? : ICommande[] ;
}