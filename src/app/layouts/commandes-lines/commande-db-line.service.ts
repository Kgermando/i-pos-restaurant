import { Injectable } from '@angular/core';
import { AbstractDatabase } from '../../shared/services/api-dexiejs.service';
import { CommandeService } from '../commandes/commande.service';
import { CommandeLineService } from './commande-line.service';
import { from, map, mergeMap, Observable, Subject } from 'rxjs';
import { ICommandeLine } from '../../models/commande_line.model'; 

@Injectable({
  providedIn: 'root'
})
export class CommandeDbLineService extends AbstractDatabase {

  readonly tablename = 'commandelines';

  constructor(
    private commandeLineService: CommandeLineService,
    private commandeService: CommandeService) {
    super()
  }

  private _refreshDataList$ = new Subject<void>();

  private _refreshData$ = new Subject<void>();

  get refreshDataList$() {
    return this._refreshDataList$;
  }

  get refreshData$() {
    return this._refreshData$;
  }

  // Gestion des produits
  create(data: ICommandeLine): Promise<number> {
    return this.db.table(this.tablename).add(data) as Promise<number>;
  }

  update(id: number, data: ICommandeLine): Promise<number> {
    return this.db.table(this.tablename).update(id, data);
  }

  delete(id: number) {
    this.db.table(this.tablename).delete(id);
  }

  getOne(id: number): Promise<ICommandeLine> {
    return this.db.table(this.tablename).get(id);
  }

  // Get All data
  getAllById(commande_id: number): Promise<ICommandeLine[]> {
    return this.db.table(this.tablename)
      .filter((data: ICommandeLine) => data.commande_id === commande_id)
      .toArray();
  }

  // Pagination et recherche pour les produits
  async getPaginated(page: number, perPage: number, searchQuery: string): Promise<ICommandeLine[]> {
    const offset = (page - 1) * perPage;
    const dataList = await this.db.table(this.tablename)
      // .filter((data: ICommandeLine) =>
      //   data.ncommande.toString().toLowerCase().includes(searchQuery.toLowerCase()) 
      // )
      .offset(offset)
      .limit(perPage)
      .toArray();
    return dataList;
  }

  async getTotalDataCount(searchQuery: string = ''): Promise<number> {
    const total = await this.db.table(this.tablename)
      // .filter((data: ICommandeLine) =>
      //   data.ncommande.toString().toLowerCase().includes(searchQuery.toLowerCase()) 
      // )
      .count();
    return total;
  }

  async getLength(commandeId: number): Promise<number> {
    return this.db.table(this.tablename)
    .filter((data: ICommandeLine) =>
      data.commande_id.toString() === commandeId.toString()
    )
    .count();
  }

  // Calculer la somme des quantités en stock
  async getTotalCmdLineQuantity(commandeId: number): Promise<number> {
    const stockItems = await this.db.table(this.tablename)
      .filter((data: ICommandeLine) =>
        data.commande_id.toString() === commandeId.toString()
      )
      .toArray();
    return stockItems.reduce((total, item: ICommandeLine) => total + item.quantity, 0);
  }


  async getCommandeLinesWithProducts(commande_id: number) {
    const commandeLines = await this.db.table(this.tablename)
    .filter((data: ICommandeLine) => data.commande_id === commande_id)
    .toArray();
    const produits = await this.db.table('products').toArray();

    return commandeLines.map(line => {
      const produit = produits.find(p => p.id === line.product_id);
      return {
        ...line,
        name: produit ? produit.name : 'Produit non trouvé',
        prix_vente: produit ? produit.prix_vente : 0,
        tva: produit ? produit.tva : 0
      };
    });


  } 
}

 