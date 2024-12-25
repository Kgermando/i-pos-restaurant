import { Component, computed, EventEmitter, Input, OnInit, Output, output, signal } from '@angular/core';
import { IProduct } from '../../../models/product.model';
import { IUser } from '../../../auth/models/user'; 
import { CommandeLineService } from '../../commandes-lines/commande-line.service';
import { StockService } from '../../stocks/stock.service';

@Component({
  selector: 'app-prod-style',
  templateUrl: './prod-style.component.html',
  styleUrl: './prod-style.component.scss'
})
export class ProdStyleComponent implements OnInit {
  @Input() currentUser!: IUser;
  @Input() item!: IProduct;

  pourcentStock = output<number>(); 
  // @Output() pourcentStock = new EventEmitter<number>();


  totalStockQty = signal<number>(0);
  totalCmdQty = signal<number>(0);

  // qtyDispo = computed(() => this.totalStockQty() - this.totalCmdQty());
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
        this.pourcentStock.emit(this.pourcentQty()); // pourcentage pour chaque stock 

        // console.log("totalStockQty", this.totalStockQty());
        // console.log("totalCmdQty", this.totalCmdQty());
        // console.log("pourcent", this.pourcentQty());
      }); 
    });
 

  } 

}
