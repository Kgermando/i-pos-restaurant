import { Component, Input, OnInit } from '@angular/core';
import { CommandeService } from '../../commandes/commande.service';

@Component({
  selector: 'app-table-total-cmd',
  templateUrl: './table-total-cmd.component.html',
  styleUrl: './table-total-cmd.component.scss'
})
export class TableTotalCmdComponent implements OnInit {
  @Input() table_box_id!: number;
  @Input() code!: number;

  totalCmdTable = 0;

  constructor(
    private commandeService: CommandeService,
  ) { }


  ngOnInit(): void {
   this.getTotalCommande();
  }



  getTotalCommande() {
    this.commandeService.GetTotalCommande(this.code, this.table_box_id).subscribe((res) => {
      this.totalCmdTable = res.data;
    });
  }

}
