export interface PaiementModel {
    ID: number; 
    created_at: Date;
    updated_at: Date;
    total_amount: number; 
    payment_mode: string;
}