import { IArea } from "./area.model";
import { IClient } from "./client.model";
import { ICommande } from "./commande.model";
import { ILivreur } from "./livreur.model";
import { IPos } from "./pos.model";

export interface ILivraison {
    ID?: number;
    CreatedAt?: Date;
    UpdatedAt?: Date;

    area_id: number; // Zone
    cout_livraison: number;
    client_id: number;
    livreur_id: number;
    operator_name: string;
    pos_id: number;
    status: string;
    signature: string;
    code_entreprise: number;

    Client?: IClient;
    Livreur?: ILivreur;
    Area?: IArea;
    Pos?: IPos;
    Commandes?: ICommande[];
}