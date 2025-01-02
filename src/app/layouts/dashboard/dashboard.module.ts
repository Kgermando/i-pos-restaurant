import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { SummaryComponent } from './summary/summary.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SummaryComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
     SharedModule,
  ]
})
export class DashboardModule { }
