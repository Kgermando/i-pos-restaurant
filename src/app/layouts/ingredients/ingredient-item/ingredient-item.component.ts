import { Component, Input, OnInit, signal } from '@angular/core';
import { IngStockService } from '../../ingredient-stocks/ing-stock.service';
import { IIngredient } from '../../../models/ingredient.model'; 
import { IUser } from '../../../auth/models/user';

@Component({
  selector: 'app-ingredient-item',
  templateUrl: './ingredient-item.component.html',
  styleUrl: './ingredient-item.component.scss'
})
export class IngredientItemComponent implements OnInit {
  @Input() ingredient!: IIngredient;
  @Input() currentUser!: IUser;

 

    montantTotalAchat = signal<number>(0); 
    stockTotal = signal<number>(0);
    stockDispo = signal<number>(0);
    pourcentstockDispo = signal<number>(0);
  

  constructor( private ingStockService: IngStockService) { }

  ngOnInit(): void {
    this.getStatsIngredientStock(this.ingredient.ID!)
  }


  getStatsIngredientStock(ingredient_id: number) {
    this.ingStockService.getStatsIngredientStock(
      this.currentUser.entreprise!.code,
      ingredient_id
    ).subscribe((res) => {
      this.montantTotalAchat.set(res.data.montanttotalachat);
      this.stockTotal.set(res.data.stocktotal);
      this.stockDispo.set(res.data.stockdispo);
      this.pourcentstockDispo.set(res.data.pourcentqtydispo);
    });
  }

}
