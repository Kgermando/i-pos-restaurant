import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../shared/services/api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IngStockService extends ApiService {
  endpoint: string = `${environment.apiUrl}/ingredients-stocks`;

  getPaginatedByIdRangeDate(
    id: number, 
    page: number, 
    pageSize: number, search: string,
    startDateStr: string,
    endDateStr: string
  ): Observable<any> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("page_size", pageSize.toString())
      .set("search", search)
      .set("start_date", startDateStr)
      .set("end_date", endDateStr)
    return this.http.get<any>(`${this.endpoint}/all/paginate/${id}`, { params });
  }

  getStatsIngredientStock(
    code_entreprise: number,
    ingredient_id: number,
  ): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/${code_entreprise}/total/get-all/${ingredient_id}`);
  }

  GetStatsParIngredientStock(
    code_entreprise: number,
    ingredient_id: number,
    startDateStr: string,
    endDateStr: string
  ): Observable<any> {
    let params = new HttpParams()
      .set("start_date", startDateStr)
      .set("end_date", endDateStr)
    return this.http.get<any>(`${this.endpoint}/${code_entreprise}/total/get/${ingredient_id}`, { params });
  }
}
