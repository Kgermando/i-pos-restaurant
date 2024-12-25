import { Injectable } from '@angular/core';
import { AbstractDatabase } from '../../shared/services/api-dexiejs.service';
import { StockService } from './stock.service';
import { Subject } from 'rxjs';
import { IStock } from '../../models/stock.model';

@Injectable({
  providedIn: 'root'
})
export class StockDbService extends AbstractDatabase {

  readonly tablename = 'stocks';

  constructor(private stockService: StockService) {
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
  create(data: IStock): Promise<number> {
    return this.db.table(this.tablename).add(data) as Promise<number>;
  }

  update(id: number, data: IStock): Promise<number> {
    return this.db.table(this.tablename).update(id, data);
  }

  delete(id: number) {
    this.db.table(this.tablename).delete(id);
  }

  get(id: number): Promise<IStock> {
    return this.db.table(this.tablename).get(id);
  }

  // Pagination et recherche pour les produits
  async getPaginated(productId: number, page: number, perPage: number, searchQuery: string): Promise<IStock[]> {
    const offset = (page - 1) * perPage;
    const products = await this.db.table(this.tablename)
      .filter((data: IStock) =>
        data.product_id === productId &&
        data.quantity.toString().includes(searchQuery)
      )
      .offset(offset)
      .limit(perPage)
      .toArray();
    return products;
  }

  async getTotalDataCount(productId: number, searchQuery: string = ''): Promise<number> {
    const total = await this.db.table(this.tablename)
      .filter((data: IStock) =>
        data.product_id === productId && 
        data.quantity.toString().includes(searchQuery)
      )
      .count();
    return total;
  }

  async getLength(productId: number): Promise<number> {
    return this.db.table(this.tablename)
    .filter((data: IStock) =>
      data.product_id === productId
    )
    .count();
  }


  async getPaginatedStocksByProduct(productId: number, page: number, perPage: number, searchQuery: string): Promise<IStock[]> {
    const offset = (page - 1) * perPage;
    const stocks = this.db.table(this.tablename)
      .orderBy('updated_at')
      .reverse()
      .filter((data: IStock) =>
        data.product_id === productId && data.quantity.toString().includes(searchQuery)
      )
      .offset(offset)
      .limit(perPage)
      .toArray();
    return stocks;
  }

  // Calculer la somme des quantités en stock
  async getTotalStockQuantity(productId: number): Promise<number> {
    const stockItems = await this.db.table(this.tablename)
      .filter((data: IStock) =>
        data.product_id.toString() === productId.toString()
      )
      .toArray();
    return stockItems.reduce((total, item: IStock) => total + item.quantity, 0);
  }
 


  async getTotalProfit(productId: number): Promise<number> {
    let profit = 0;

    const stockItems = await this.db.table(this.tablename)
      .filter((data: IStock) =>
        data.product_id.toString() === productId.toString()
      )
      .toArray();

    const totalPriceAchat = stockItems.reduce((total, item: IStock) => total + item.quantity, 0);
    const totalPriceVente = stockItems.reduce((total, item: IStock) => total + item.quantity, 0);

    profit = totalPriceVente - totalPriceAchat;

    return profit;
  }


}
