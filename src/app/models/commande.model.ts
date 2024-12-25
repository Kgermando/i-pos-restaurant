import { IClient } from "./client.model";
import { ICommandeLine } from "./commande_line.model";
import { ITableBox } from "./table-box.model";

export interface ICommande {
	ID?: number;
	CreatedAt?: Date;
	UpdatedAt?: Date;
	table_box_id: number;
	TableBox?: ITableBox;
	ncommande?: number;
	status: string;
	client_id?: number;
	Client?: IClient;
	signature: string;
	pos_id?: number;
	code_entreprise?: number;
	commandeLines?: ICommandeLine[];
}
 