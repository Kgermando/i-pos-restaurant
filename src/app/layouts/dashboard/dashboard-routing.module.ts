import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashPlatProductComponent } from './dash-plat-product/dash-plat-product.component';
import { DashCaisseComponent } from './dash-caisse/dash-caisse.component';
import { DashClientFournisseurComponent } from './dash-client-fournisseur/dash-client-fournisseur.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, children: [
    { path: 'dash-plat-products', component: DashPlatProductComponent },
    { path: 'dash-caisse', component: DashCaisseComponent },
    { path: 'dash-client-fournisseur', component: DashClientFournisseurComponent },

    { path: '', redirectTo: 'dash-caisse', pathMatch: 'full' }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
