import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { environment } from '../../../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class DashCaisseService extends ApiService {
  endpoint: string = `${environment.apiUrl}/dashboard`;

  // Total caisse
  GetTotalCaisse(code_entreprise: number,
    startDateStr: string, endDateStr: string): Observable<any> {
    let params = new HttpParams()
      .set("start_date", startDateStr)
      .set("end_date", endDateStr)
    return this.http.get<any>(`${this.endpoint}/${code_entreprise}/caisses/total`, { params });
  }

  GetTotalVentesParJour(
    code_entreprise: number,
  ): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/${code_entreprise}/caisses/total-ventes-journalieres`);
  }

  GetCourbeVenteProfit24h(
    code_entreprise: number,
  ): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/${code_entreprise}/caisses/courbe-ventes-profits`);
  }




  // Tableau des entrees et sorties
  GetTableauEntreeSorties(code_entreprise: number, page: number, pageSize: number,
    startDateStr: string, endDateStr: string): Observable<ApiResponse> {
    let params = new HttpParams()
      .set("page", page.toString())
      .set("page_size", pageSize.toString())
      .set("start_date", startDateStr)
      .set("end_date", endDateStr)
    return this.http.get<ApiResponse>(`${this.endpoint}/${code_entreprise}/caisses/tableau-entrees-sorties`, { params });
  }

  // Tableau des entrees et sorties
  GetTotalParCaisse(code_entreprise: number, startDateStr: string, endDateStr: string): Observable<ApiResponse> {
    let params = new HttpParams()
      .set("start_date", startDateStr)
      .set("end_date", endDateStr)
    return this.http.get<ApiResponse>(`${this.endpoint}/${code_entreprise}/caisses/total-par-caisse`, { params });
  }
}
