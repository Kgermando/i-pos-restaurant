import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class CommandeService extends ApiService {
  endpoint: string = `${environment.apiUrl}/commandes`;

  GetTotalCommande(code_entreprise: number, table_box_id: number): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/${code_entreprise}/${table_box_id}/total`);
  }
}
