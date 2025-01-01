import { IComposition } from "./composition.model";

export interface IIngredient {
    ID?: number;
    name: string;
    description: string; 
    unite: string;
    pos_id: number;
    CreatedAt?: Date;
    UpdatedAt?: Date;
    signature: string;
    code_entreprise: number;
    Compositions?: IComposition[]; 
}
