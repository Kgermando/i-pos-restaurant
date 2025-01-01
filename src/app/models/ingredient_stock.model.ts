import { IFournisseur } from "./fournisseur.model";
import { IIngredient } from "./ingredient.model";

export interface IIngredientStock {
    ID?: number;
    pos_id?: number;
    ingredient_id: number;
    description: string;
    quantity: number;
    fournisseur_id?: number; 
    Fournisseur?: IFournisseur;
    prix_achat: number;
    date_expiration: Date;
    signature: string;
    code_entreprise?: number;
    Ingredient?: IIngredient;
    CreatedAt?: Date;
    UpdatedAt?: Date;
} 