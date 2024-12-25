import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutsComponent } from './layouts.component';
import { ProfileComponent } from './profile/profile.component';
import { EntrepriseComponent } from './entreprise/entreprise.component';
import { PosComponent } from './pos/pos.component';
import { PosViewComponent } from './pos/pos-view/pos-view.component';
import { ProductComponent } from './products/product/product.component';
import { StocksComponent } from './stocks/stocks.component';
import { StockViewComponent } from './stocks/stock-view/stock-view.component';
import { CommandesComponent } from './commandes/commandes.component';
import { ClientsComponent } from './clients/clients.component';
import { FournisseursComponent } from './fournisseurs/fournisseurs.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CommandesLinesComponent } from './commandes-lines/commandes-lines.component';
import { FactureViewComponent } from './commandes/facture-view/facture-view.component';
import { PlatComponent } from './plat/plat.component';
import { TableBoxComponent } from './table-box/table-box.component';
import { ProductLineComponent } from './commandes-lines/product-line/product-line.component';
import { PlatLineComponent } from './commandes-lines/plat-line/plat-line.component';

const routes: Routes = [
  {
    path: '', component: LayoutsComponent, children: [
      {
        path: 'profil',
        component: ProfileComponent,
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./user/user.module').then(
            (m) => m.UserModule
          ),
      },
      {
        path: 'entreprises/entreprise-list',
        component: EntrepriseComponent,
      },
      {
        path: 'pos/pos-list',
        component: PosComponent,
      },
      {
        path: 'pos/:id/view',
        component: PosViewComponent,
      },
      {
        path: 'table-box/table-box-list',
        component: TableBoxComponent,
      },
      {
        path: 'table-box/commandes/:id/table-view',
        component: CommandesComponent,
      }, 
      {
        path: 'table-box/commandes/:id/line',
        component: CommandesLinesComponent, children: [
          {
            path: 'product-line',
            component: ProductLineComponent, 
          },
          {
            path: 'plat-line',
            component: PlatLineComponent,
          },
          {
            path: '',
            redirectTo: 'plat-line',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'table-box/commandes/:id/facture/:number',
        component: FactureViewComponent,
      },
      {
        path: 'plats/plat-list',
        component: PlatComponent,
      },
      {
        path: 'products/product-list',
        component: ProductComponent,
      },
      {
        path: 'products/:id/stocks',
        component: StocksComponent,
      },
      {
        path: 'stocks/:id/view',
        component: StockViewComponent,
      },
      {
        path: 'clients/client-list',
        component: ClientsComponent,
      },
      {
        path: 'fournisseurs/fournisseur-list',
        component: FournisseursComponent,
      }, 
      {
        path: 'dashboard',
        component: DashboardComponent,
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutsRoutingModule { }
