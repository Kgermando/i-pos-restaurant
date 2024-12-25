import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/model/api-response.model';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends ApiService {
  endpoint: string = `${environment.apiUrl}/dashboard`;

  getDashboardStock(code_entreprise: number, page: number, pageSize: number,
    startDateStr: string, endDateStr: string): Observable<ApiResponse> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("page_size", pageSize.toString())
      .set("start_date", startDateStr)
      .set("end_date", endDateStr)
    return this.http.get<ApiResponse>(`${this.endpoint}/${code_entreprise}/all/stocks`, { params });
  }

  getDashboardCommandeLine(
    code_entreprise: number,
    page: number,
    pageSize: number,
    startDateStr: string,
    endDateStr: string
  ): Observable<ApiResponse> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("page_size", pageSize.toString())
      .set("start_date", startDateStr)
      .set("end_date", endDateStr)
    return this.http.get<ApiResponse>(`${this.endpoint}/${code_entreprise}/all/commandeline`, { params });
  }

  getEntreeSortie(
    code_entreprise: number,
    startDateStr: string,
    endDateStr: string
  ): Observable<ApiResponse> {
    let params = new HttpParams()
      .set("start_date", startDateStr)
      .set("end_date", endDateStr)
    return this.http.get<ApiResponse>(`${this.endpoint}/${code_entreprise}/all/entree-sortie`, { params });
  }

  getSaleProfit(
    code_entreprise: number,
    startDateStr: string,
    endDateStr: string
  ): Observable<ApiResponse> {
    let params = new HttpParams()
      .set("start_date", startDateStr)
      .set("end_date", endDateStr)
    return this.http.get<ApiResponse>(`${this.endpoint}/${code_entreprise}/all/sales-profits`, { params });
  }

  getStockDisponible(
    code_entreprise: number,
    startDateStr: string,
    endDateStr: string
  ): Observable<ApiResponse> {
    let params = new HttpParams()
      .set("start_date", startDateStr)
      .set("end_date", endDateStr)
    return this.http.get<ApiResponse>(`${this.endpoint}/${code_entreprise}/all/stocks-disponible`, { params });
  }
 
  getTotalProductInStock(
    code_entreprise: number,
    startDateStr: string,
    endDateStr: string
  ): Observable<any> {
    let params = new HttpParams()
      .set("start_date", startDateStr)
      .set("end_date", endDateStr)
    return this.http.get<any>(`${this.endpoint}/${code_entreprise}/all/total-product-in-stock`, { params });
  }

  getTotalStockDispoSortie(
    code_entreprise: number,
    startDateStr: string,
    endDateStr: string
  ): Observable<any> {
    let params = new HttpParams()
      .set("start_date", startDateStr)
      .set("end_date", endDateStr)
    return this.http.get<any>(`${this.endpoint}/${code_entreprise}/all/total-stock-dispo-sortie`, { params });
  }

  getTotalValeurProduct(
    code_entreprise: number,
    startDateStr: string,
    endDateStr: string
  ): Observable<any> {
    let params = new HttpParams()
      .set("start_date", startDateStr)
      .set("end_date", endDateStr)
    return this.http.get<any>(`${this.endpoint}/${code_entreprise}/all/total-valeur-products`, { params });
  }

  getCourbeVente24h(
    code_entreprise: number,
  ): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/${code_entreprise}/all/courbe-ventes-jour`);
  }

  getTotalVente24h(
    code_entreprise: number,
  ): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/${code_entreprise}/all/total-ventes-jour`);
  }
  
} 
 