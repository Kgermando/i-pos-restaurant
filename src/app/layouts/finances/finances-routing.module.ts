import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancesComponent } from './finances.component';
import { CaisseComponent } from './caisse/caisse.component';

const routes: Routes = [
  {
    path: '', component: FinancesComponent, children: [
      { path: 'caisse-list', component: CaisseComponent },

      { path: '', redirectTo: 'caisse-list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancesRoutingModule { }
