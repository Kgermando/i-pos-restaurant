import { Injectable } from '@angular/core';
import { AbstractDatabase } from '../../shared/services/api-dexiejs.service';
import { CommandeService } from './commande.service';
import { Subject } from 'rxjs';
import { ICommande } from '../../models/commande.model';

@Injectable({
  providedIn: 'root'
})
export class CommandeDbService extends AbstractDatabase {

  readonly tablename = 'commandes';

  constructor(private commandeService: CommandeService) {
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
  create(data: ICommande): Promise<number> {
    return this.db.table(this.tablename).add(data) as Promise<number>;
  }

  update(id: number, data: ICommande): Promise<number> {
    return this.db.table(this.tablename).update(id, data);
  }

  delete(id: number) {
    this.db.table(this.tablename).delete(id);
  }

  getOne(id: number): Promise<ICommande> {
    return this.db.table(this.tablename).get(id);
  }

  // Pagination et recherche pour les produits
  async getPaginated(page: number, perPage: number, searchQuery: string): Promise<ICommande[]> {
    const offset = (page - 1) * perPage;
    const dataList = await this.db.table(this.tablename)
      .filter((data: ICommande) =>
        data.ncommande!.toString().toLowerCase().includes(searchQuery.toLowerCase()) 
      )
      .offset(offset)
      .limit(perPage)
      .toArray();
    return dataList;
  }

  async getTotalDataCount(searchQuery: string = ''): Promise<number> {
    const total = await this.db.table(this.tablename)
      .filter((data: ICommande) =>
        data.ncommande!.toString().toLowerCase().includes(searchQuery.toLowerCase()) 
      )
      .count();
    return total;
  }

  async getLength(): Promise<number> {
    return this.db.table(this.tablename).count();
  }
 

    // Joindre les tables 'stock' et 'fournisseur' et récupérer les données
    async getStockWithSuppliers(): Promise<any[]> {
      const stocks = await this.db.table('stocks').toArray();
      const fournisseurs = await this.db.table('fournisseur').toArray();
      
      const result = stocks.map(stock => {
        const supplier = fournisseurs.find(supplier => supplier.id === stock.supplierId);
        return {
          ...stock,
          supplierName: supplier ? supplier.name : 'Unknown',
          supplierContact: supplier ? supplier.contactInfo : 'Unknown'
        };
      });
      
      return result;
    }

}
