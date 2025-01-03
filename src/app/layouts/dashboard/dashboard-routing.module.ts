import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashPlatProductComponent } from './dash-plat-product/dash-plat-product.component';
import { DashCaisseComponent } from './dash-caisse/dash-caisse.component';
import { DashLivraisonComponent } from './dash-livraison/dash-livraison.component';
import { DashClientFournisseurComponent } from './dash-client-fournisseur/dash-client-fournisseur.component';
import { DashIngredientComponent } from './dash-ingredient/dash-ingredient.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, children: [
    { path: 'dash-plat-products', component: DashPlatProductComponent },
    { path: 'dash-caisse', component: DashCaisseComponent },
    { path: 'dash-livraison', component: DashLivraisonComponent },
    { path: 'dash-client-fournisseur', component: DashClientFournisseurComponent },
    { path: 'dash-ingredient', component: DashIngredientComponent },

    { path: '', redirectTo: 'dash-plat-products', pathMatch: 'full' }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
