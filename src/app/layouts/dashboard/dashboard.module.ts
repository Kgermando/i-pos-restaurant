import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { DashCaisseComponent } from './dash-caisse/dash-caisse.component';
import { DashClientFournisseurComponent } from './dash-client-fournisseur/dash-client-fournisseur.component';
import { DashPlatProductComponent } from './dash-plat-product/dash-plat-product.component';


@NgModule({
  declarations: [
    DashboardComponent,
    DashCaisseComponent,
    DashClientFournisseurComponent,
    DashPlatProductComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
     SharedModule,
  ]
})
export class DashboardModule { }
