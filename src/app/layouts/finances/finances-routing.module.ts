import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancesComponent } from './finances.component';
import { CaisseComponent } from './caisse/caisse.component';
import { CaisseItemComponent } from './caisse/caisse-item/caisse-item.component';

const routes: Routes = [
  {
    path: '', component: FinancesComponent, children: [
      { path: 'caisse-list', component: CaisseComponent, children: [
        { path: ':id/items', component: CaisseItemComponent },
      ] 
    },
     

      { path: '', redirectTo: 'caisse-list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancesRoutingModule { }
