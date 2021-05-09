import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from './admin-panel/dashboard/dashboard.component';
import {UpdateJewelryComponent} from './admin-panel/update-jewelry/update-jewelry.component';

const routes: Routes = [
  {
    path: 'admin',
    children: [
      { path: 'add', component: UpdateJewelryComponent },
      { path: '', component: DashboardComponent }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {})
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule {

}
