import { Injectable } from '@angular/core';
import { AbstractDatabase } from '../../shared/services/api-dexiejs.service';
import { Subject } from 'rxjs';
import { ClientService } from './client.service';
import { IClient } from '../../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientDbService extends AbstractDatabase {

  readonly tablename = 'clients';

  constructor(private clientService: ClientService) {
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
  create(data: IClient) {
    this.db.table(this.tablename).add(data)
  }

  update(id: number, data: IClient) {
    this.db.table(this.tablename).update(id, data);
  }

  delete(id: number) {
    this.db.table(this.tablename).delete(id);
  }

  getOne(id: number): Promise<IClient> {
    return this.db.table(this.tablename).get(id);
  }

  // Get all data
  getAll(): Promise<IClient[]> {
    return this.db.table(this.tablename).toArray();
  }

  // Pagination et recherche pour les produits
  async getPaginated(page: number, perPage: number, searchQuery: string): Promise<IClient[]> {
    const offset = (page - 1) * perPage;
    const products = await this.db.table(this.tablename)
      .filter((data: IClient) =>
        data.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        data.telephone.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .offset(offset)
      .limit(perPage)
      .toArray();
    return products;
  }

  async getTotalDataCount(searchQuery: string = ''): Promise<number> {
    const total = await this.db.table(this.tablename)
      .filter((data: IClient) =>
        data.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        data.telephone.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .count();
    return total;
  }

  async getLength(): Promise<number> {
    return this.db.table(this.tablename).count();
  }


}
