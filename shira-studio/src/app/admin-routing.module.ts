import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from './admin-panel/dashboard/dashboard.component';
import {UpdateJewelryComponent} from './admin-panel/update-jewelry/update-jewelry.component';
import {JewelryListComponent} from './admin-panel/jewelry-list/jewelry-list.component';
import {CategoriesListComponent} from './admin-panel/categories-list/categories-list.component';

const routes: Routes = [
  {
    path: 'admin',
    children: [
      { path: 'add-item', component: UpdateJewelryComponent },
      { path: 'edit-item/:id', component: UpdateJewelryComponent },
      { path: 'jewelry-list/:category', component: JewelryListComponent },
      { path: 'categories-list', component: CategoriesListComponent },
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
