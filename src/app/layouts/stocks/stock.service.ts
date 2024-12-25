import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService extends ApiService {
  endpoint: string = `${environment.apiUrl}/stocks`;
 

  GetStockMargeBeneficiaire(product_id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/all/get/${product_id}`);
  }

}