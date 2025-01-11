import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CaisseService extends ApiService {
  endpoint: string = `${environment.apiUrl}/caisses`;
  
  GetTotalAllCaisses(code_entreprise: number): Observable<any> {
    return this.http.get<any>(`${this.endpoint}/${code_entreprise}/all/total`);
  }
}