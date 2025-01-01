import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommandeLineService extends ApiService {
  endpoint: string = `${environment.apiUrl}/commandes-lines`;


  getAllByIdLivraison(livraison_id: number): Observable<any> {
    return this.http.get(`${this.endpoint}/all/livraison/${livraison_id}`);
  }
} 