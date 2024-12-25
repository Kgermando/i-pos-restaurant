import { Injectable } from '@angular/core';
import { AbstractDatabase } from '../../shared/services/api-dexiejs.service';
import { FournisseurService } from './fournisseur.service';
import { Subject } from 'rxjs';
import { IFournisseur } from '../../models/fournisseur.model';

@Injectable({
  providedIn: 'root'
})
export class FournisseurDbService extends AbstractDatabase { 

  readonly tablename = 'fournisseurs';

  constructor(private fournisseurService: FournisseurService) {
    super();
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
  create(data: IFournisseur) {
    this.db.table(this.tablename).add(data)
  }

  update(id: number, data: IFournisseur) {
    this.db.table(this.tablename).update(id, data);
  }

  delete(id: number) {
    this.db.table(this.tablename).delete(id);
  }

  getOne(id: number): Promise<IFournisseur> {
    return this.db.table(this.tablename).get(id);
  }

  // Get All data
  getAll(): Promise<IFournisseur[]> {
    return this.db.table(this.tablename).toArray();
  }


  // Pagination et recherche pour les produits
  async getPaginated(page: number, perPage: number, searchQuery: string): Promise<IFournisseur[]> {
    const offset = (page - 1) * perPage;
    const products = await this.db.table(this.tablename)
      .filter((data: IFournisseur) =>
        data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        data.type_fourniture.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .offset(offset)
      .limit(perPage)
      .toArray();
    return products;
  }

  async getTotalDataCount(searchQuery: string = ''): Promise<number> {
    const total = await this.db.table(this.tablename)
      .filter((data: IFournisseur) =>
        data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        data.type_fourniture.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .count();
    return total;
  }

  async getLength(): Promise<number> {
    return this.db.table(this.tablename).count();
  }
 

}

