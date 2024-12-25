import { IFournisseur } from "./fournisseur.model";
import { IProduct } from "./product.model";

export interface IStock {
    ID?: number;
    pos_id?: number;
    product_id: number;
    description: string;
    quantity: number;
    fournisseur_id?: number; 
    Fournisseur?: IFournisseur;
    prix_achat: number;
    date_expiration: Date;
    signature: string;
    code_entreprise?: number;
    Product?: IProduct;
    CreatedAt?: Date;
    UpdatedAt?: Date;
} 