import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { environment } from '../../../../environments/environment';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/model/api-response.model';

@Injectable({
	providedIn: 'root'
})
export class DashClientFournisseurLivraisonService extends ApiService {
	endpoint: string = `${environment.apiUrl}/dashboard`;

	//   Get total client et fournisseur et zone de livraison
	GetTotalClientFournisseur(code_entreprise: number): Observable<any> {
		return this.http.get<any>(`${this.endpoint}/${code_entreprise}/cl-fseur-liv/total`);
	}

	// Taux de consommation entre livriason et table
	GetCourbeZoneLivraison(code_entreprise: number): Observable<any> {
		return this.http.get<any>(`${this.endpoint}/${code_entreprise}/cl-fseur-liv/courbe-areas`);
	}

	// best-clients

	GetClientsWithMostDeliveries(code_entreprise: number): Observable<ApiResponse> {
		return this.http.get<ApiResponse>(`${this.endpoint}/${code_entreprise}/cl-fseur-liv/best-clients`);
	}


	// best-fournisseurs
	GetTop10FournisseursWithMostStockValue(code_entreprise: number): Observable<ApiResponse> {
		return this.http.get<ApiResponse>(`${this.endpoint}/${code_entreprise}/cl-fseur-liv/best-fournisseurs`);
	}


}
