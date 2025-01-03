import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { SummaryComponent } from './summary/summary.component';
import { DashCaisseComponent } from './dash-caisse/dash-caisse.component';
import { DashLivraisonComponent } from './dash-livraison/dash-livraison.component';
import { DashClientFournisseurComponent } from './dash-client-fournisseur/dash-client-fournisseur.component';
import { DashIngredientComponent } from './dash-ingredient/dash-ingredient.component';
import { DashPlatProductComponent } from './dash-plat-product/dash-plat-product.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SummaryComponent,
    DashCaisseComponent,
    DashLivraisonComponent,
    DashClientFournisseurComponent,
    DashIngredientComponent,
    DashPlatProductComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
     SharedModule,
  ]
})
export class DashboardModule { }
