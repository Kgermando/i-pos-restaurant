import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancesRoutingModule } from './finances-routing.module';
import { CaisseComponent } from './caisse/caisse.component';
import { SharedModule } from '../../shared/shared.module';
import { FinancesComponent } from './finances.component';


@NgModule({
  declarations: [
    CaisseComponent,
    FinancesComponent
  ],
  imports: [
    CommonModule,
    FinancesRoutingModule,
    SharedModule,
  ]
})
export class FinancesModule { }
