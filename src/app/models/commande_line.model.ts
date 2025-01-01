import { IClient } from "./client.model";
import { ICommande } from "./commande.model";
import { IPlat } from "./plat.model";
import { IProduct } from "./product.model";

export interface ICommandeLine {
    ID?: number; 
    CreatedAt?: Date;
    UpdatedAt?: Date;
    commande_id: number;
    livraison_id: number;
    product_id: number;
    plat_id: number;
    quantity: number; 
    code_entreprise?: number;
    Commande?: ICommande;
    Product?: IProduct;
    Plat?: IPlat;

}
