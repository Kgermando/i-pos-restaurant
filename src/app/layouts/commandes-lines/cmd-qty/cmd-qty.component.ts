import { Component, computed, Input, OnInit, Output, output, signal } from '@angular/core';
import { IProduct } from '../../../models/product.model'; 
import { IUser } from '../../../auth/models/user';
import { IStockDispo } from '../../../models/stock_dispo.model';
import { CommandeLineService } from '../commande-line.service';
import { StockService } from '../../stocks/stock.service';

@Component({
  selector: 'app-cmd-qty',
  templateUrl: './cmd-qty.component.html',
  styleUrl: './cmd-qty.component.scss'
})
export class CmdQtyComponent implements OnInit {
  @Input() currentUser!: IUser;
  @Input() product!: IProduct; 
 
  qtyOutput = output<number>();

  isloading = true; 

  stockQty = signal<number>(0);
  cmdLineQty = signal<number>(0); 
  stockDispo = computed(() => this.stockQty() - this.cmdLineQty());
  pourcentQty = computed(() => 100 - (this.cmdLineQty() * 100 / this.stockQty()));

  
  constructor(
    private commaneLineService: CommandeLineService,
    private stocksService: StockService,
  ) { } 


  ngOnInit(): void {
    this.getTotalQty();
  }

  getTotalQty() {
    this.commaneLineService.getTotalQty(this.product.ID!).subscribe((res) => {
      this.cmdLineQty.set(res.data); 
      this.isloading = false;
    });
    this.stocksService.getTotalQty(this.product.ID!).subscribe((res) => {
      this.stockQty.set(res.data);

      this.qtyOutput.emit(this.stockDispo());
      
      this.isloading = false;
    });
  }
  

 
}
