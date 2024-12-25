export interface IPlat {
    ID?: number;
    reference: string;
    name: string;
    description: string;
    unite_vente: string;
    prix_vente: number;
    tva: number;
    pos_id?: number;
    code_entreprise?: number;
    CreatedAt?: Date;
    UpdatedAt?: Date;
    signature: string;
}