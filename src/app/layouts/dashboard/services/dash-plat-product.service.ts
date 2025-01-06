import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { environment } from '../../../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class DashPlatProductService extends ApiService {
  endpoint: string = `${environment.apiUrl}/dashboard`;

  // Total Plat et produit vendu
  GetTotalPlatProductVendu(code_entreprise: number, 
    startDateStr: string, endDateStr: string): Observable<any> {
    let params = new HttpParams()
      .set("start_date", startDateStr)
      .set("end_date", endDateStr)
    return this.http.get<any>(`${this.endpoint}/${code_entreprise}/plats-products/ventes`, { params });
  }

// Courbe de vente et profits des plats et produits
  GetVenteProfitPlatProductMonth(code_entreprise: number, 
    startDateStr: string, endDateStr: string): Observable<any> {
    let params = new HttpParams()
      .set("start_date", startDateStr)
      .set("end_date", endDateStr)
    return this.http.get<any>(`${this.endpoint}/${code_entreprise}/plats-products/courbe-ventes-profits`, { params });
  }

  // Gauge de stock disponible
  // getStockDisponible(
  //   code_entreprise: number,
  //   startDateStr: string,
  //   endDateStr: string
  // ): Observable<ApiResponse> {
  //   let params = new HttpParams()
  //     .set("start_date", startDateStr)
  //     .set("end_date", endDateStr)
  //   return this.http.get<ApiResponse>(`${this.endpoint}/${code_entreprise}/all/stocks-disponible`, { params });
  // }

  // Tableau des sortie des plats et produits Table
  GetTablePaginatedCmdLineSortieProductPlat(code_entreprise: number, page: number, pageSize: number,
    startDateStr: string, endDateStr: string): Observable<ApiResponse> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("page_size", pageSize.toString())
      .set("start_date", startDateStr)
      .set("end_date", endDateStr)
    return this.http.get<ApiResponse>(`${this.endpoint}/${code_entreprise}/plats-products/table/tableau-sortie-products-plats`, { params });
  }

    // Tableau des sortie des plats et produits Livraison
    GetLivraisonPaginatedCmdLineSortieProductPlat(code_entreprise: number, page: number, pageSize: number,
      startDateStr: string, endDateStr: string): Observable<ApiResponse> {
      let params = new HttpParams()
        .set("page", page.toString())
        .set("page_size", pageSize.toString())
        .set("start_date", startDateStr)
        .set("end_date", endDateStr)
      return this.http.get<ApiResponse>(`${this.endpoint}/${code_entreprise}/plats-products/livraison/tableau-sortie-products-plats`, { params });
    }


    // Pourcentage entre livraison et table
    GetCommandeLineLivraisonPercentage(code_entreprise: number, 
      startDateStr: string, endDateStr: string): Observable<any> {
      let params = new HttpParams()
        .set("start_date", startDateStr)
        .set("end_date", endDateStr)
      return this.http.get<any>(`${this.endpoint}/${code_entreprise}/plats-products/percentage`, { params });
    }

    // Taux de consommation entre livriason et table
    GetCommandeLineLivraisonPieChartData(code_entreprise: number, 
      startDateStr: string, endDateStr: string): Observable<any> {
      let params = new HttpParams()
        .set("start_date", startDateStr)
        .set("end_date", endDateStr)
      return this.http.get<any>(`${this.endpoint}/${code_entreprise}/plats-products/livraison-count`, { params });
    }
  

}

 