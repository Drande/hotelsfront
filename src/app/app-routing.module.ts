import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "auth",
    loadChildren: () =>   import("./auth/auth.module").then(m => m.AuthModule)
  },
  {
    path: "home",
    loadChildren: () =>   import("./home/home.module").then(m => m.HomeModule)
  },
  {
    path: "admin",
    loadChildren: () =>   import("./admin/admin.module").then(m => m.AdminModule)
  },
  {
    path: "**",
    redirectTo: "auth"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
