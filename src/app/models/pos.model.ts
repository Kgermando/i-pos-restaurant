import { ICommande } from "./commande.model";
import { IEntreprise } from "./entreprise.model";
import { IStock } from "./stock.model";

export interface IPos {
    ID: number;
    entreprise_id: number;
    entreprise: IEntreprise;
    name: string;
    adresse: string;
	email: string; 
    telephone: string;
    manager: string;
    status: string;  // Actif ou Inactif
    signature: string; 
	stocks : IStock[];
	commandes: ICommande[];
}