export interface IFacture {
    id?: number; 
    created_at?: Date;
    updated_at?: Date;
    n_facture: number;
    commande_id?: number;
    status: string; // Cash ou Creance
    delai_paiement?: Date;
    signature: string;
	pos_id?: number;
	code_entreprise?: number; 
}
