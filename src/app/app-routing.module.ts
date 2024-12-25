import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth', loadChildren: () => import("../app/auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: 'web', loadChildren: () => import("../app/layouts/layouts.module").then((m) => m.LayoutsModule),
  },

  { path: '', redirectTo: "auth", pathMatch: 'full'},
  { path: '**', redirectTo: "auth", pathMatch: 'full'},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
