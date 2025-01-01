import { IIngredient } from "./ingredient.model";
import { IPlat } from "./plat.model";
import { IPos } from "./pos.model";

export interface IComposition {
    ID?: number; 
    pos_id: number;
    plat_id: number;
    ingredient_id: number;
    quantity: number;
    signature: string;
    code_entreprise: number;
    Plat?: IPlat;
    Ingredient?: IIngredient;
    Pos?: IPos
    CreatedAt?: Date;
    UpdatedAt?: Date; 
}
