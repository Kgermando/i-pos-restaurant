import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdDataService {
  private idSource = new BehaviorSubject<number>(0); // Valeur initiale 0 au lieu de null
  currentId = this.idSource.asObservable();

  private pLength = new BehaviorSubject<number>(0); // Valeur initiale 0 au lieu de null
  prodLength = this.pLength.asObservable();

  private plLength = new BehaviorSubject<number>(0); // Valeur initiale 0 au lieu de null
  platLength = this.plLength.asObservable();

  changeId(id: number) {
    this.idSource.next(id);
  }

  // PRoduct
  changeProd(length: number) {
    this.pLength.next(length);
  }

  // Plat
  changePlat(length: number) {
    this.plLength.next(length);
  }
}
