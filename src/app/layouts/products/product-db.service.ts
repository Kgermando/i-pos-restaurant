import { Injectable } from '@angular/core';
import { AbstractDatabase } from '../../shared/services/api-dexiejs.service';
import { IProduct } from '../../models/product.model';
import { Subject } from 'rxjs';
import { ProductService } from './product.service';  

@Injectable({
  providedIn: 'root'
})
export class ProductDbService extends AbstractDatabase {

  readonly tablename = 'products';

  constructor(private productService: ProductService) {
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
  create(product: IProduct) {
    this.db.table(this.tablename).add(product)
  }

  update(id: number, product: IProduct) {
    this.db.table(this.tablename).update(id, product);
  }

  delete(id: number) {
    this.db.table(this.tablename).delete(id);
  }

  getOne(id: number): Promise<IProduct> {
    console.log(`Recherche du produit avec l'ID ${id}`);
    return this.db.table(this.tablename).get(id);
  }


  // Pagination et recherche pour les produits
  async getPaginated(page: number, perPage: number, searchQuery: string): Promise<IProduct[]> {
    const offset = (page - 1) * perPage;
    const products = await this.db.table(this.tablename)
      .filter((data: IProduct) =>
        data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        data.reference.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .offset(offset)
      .limit(perPage)
      .toArray();
    return products;
  }

    // Recherche pour les produits
    async getSearch(searchQuery: string): Promise<IProduct[]> {
      const products = await this.db.table(this.tablename)
        .filter((data: IProduct) =>
          data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          data.reference.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .toArray();
      return products;
    }
  

  async getTotalDataCount(searchQuery: string = ''): Promise<number> {
    const total = await this.db.table(this.tablename)
      .filter((data: IProduct) =>
        data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        data.reference.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .count();
    return total;
  }

  async getLength(): Promise<number> {
    return this.db.table(this.tablename).count();
  }
 

}
