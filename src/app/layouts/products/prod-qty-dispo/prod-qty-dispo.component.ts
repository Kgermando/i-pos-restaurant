import { Component, computed, Input, signal } from '@angular/core';
import { IProduct } from '../../../models/product.model';
import { IUser } from '../../../auth/models/user';
import { StockService } from '../../stocks/stock.service';
import { CommandeLineService } from '../../commandes-lines/commande-line.service';

@Component({
  selector: 'app-prod-qty-dispo',
  templateUrl: './prod-qty-dispo.component.html',
  styleUrl: './prod-qty-dispo.component.scss'
})
export class ProdQtyDispoComponent {
  @Input() currentUser!: IUser;
  @Input() item!: IProduct;

  totalStockQty = signal<number>(0);
  totalCmdQty = signal<number>(0);
 
  
  qtyDispo = computed(() => this.totalStockQty() - this.totalCmdQty());
  pourcentQty = computed(() => 100 - (this.totalCmdQty() * 100 / this.totalStockQty()));


  constructor(
    private stockService: StockService,
    private commaneLineService: CommandeLineService,
  ) { }

  ngOnInit(): void {
    this.calculatePourcentStock();
  }


  calculatePourcentStock() {
    this.stockService.getTotalQty(this.item.ID!).subscribe((res) => {
      this.totalStockQty.set(res.data);
      this.commaneLineService.getTotalQty(this.item.ID!).subscribe((line) => {
        this.totalCmdQty.set(line.data);
      }); 
    });
 

  } 

}
