import { Injectable } from '@angular/core';
import { AbstractDatabase } from '../../shared/services/api-dexiejs.service';
import { IStockDispo } from '../../models/stock_dispo.model';

@Injectable({
  providedIn: 'root'
})
export class StockDispoDBService extends AbstractDatabase {

  readonly tablename = 'stocks_dispo';

  constructor() {
    super();
  }
 
  create(data: IStockDispo): Promise<number>  {
    return this.db.table(this.tablename).add(data) as Promise<number>;
  }

  update(id: number, data: IStockDispo): Promise<number> {
    return this.db.table(this.tablename).update(id, data);
  }

  delete(id: number) {
    this.db.table(this.tablename).delete(id);
  }

  get(id: number): Promise<IStockDispo> {
    return this.db.table(this.tablename).get(id);
  }

  async getProduct(productId: number): Promise<IStockDispo> {  
    return this.db.table(this.tablename)
    .filter((data: IStockDispo) =>
      data.product_id === productId
    )
    .first();
  }
  
  async getLength(productId: number): Promise<number> {
    return this.db.table(this.tablename)
    .filter((data: IStockDispo) =>
      data.product_id === productId
    )
    .count();
  }
 
 

  async QtyStock(productId: number): Promise<number> {
    const stockItems = await this.db.table(this.tablename)
      .filter((data: IStockDispo) =>
        data.product_id.toString() === productId.toString()
      )
      .toArray();
    return stockItems.reduce((total, item: IStockDispo) => total + item.qty_stock, 0);
  }

  async QtyCmdLine(productId: number): Promise<number> {
    const stockItems = await this.db.table(this.tablename)
      .filter((data: IStockDispo) =>
        data.product_id.toString() === productId.toString()
      )
      .toArray();
    return stockItems.reduce((total, item: IStockDispo) => total + item.qty_cmdline, 0);
  }

 

}
