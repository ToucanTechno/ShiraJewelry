import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from './admin-panel/dashboard/dashboard.component';
import {UpdateJewelryComponent} from './admin-panel/update-jewelry/update-jewelry.component';
import {JewelryListComponent} from './admin-panel/jewelry-list/jewelry-list.component';
import {CategoriesListComponent} from './admin-panel/categories-list/categories-list.component';
import {UpdateCategoryComponent} from './admin-panel/update-category/update-category.component';

const routes: Routes = [
  {
    path: 'admin',
    children: [
      { path: 'edit-product/:id', component: UpdateJewelryComponent, data: { type: 'edit' } },
      { path: 'add-product', component: UpdateJewelryComponent, data: { type: 'add' } },
      { path: 'edit-category/:category', component: UpdateCategoryComponent, data: { type: 'edit' } },
      { path: 'add-category', component: UpdateCategoryComponent, data: { type: 'add' } },
      { path: 'edit-categories', component: CategoriesListComponent },
      { path: 'edit-products', component: JewelryListComponent },
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
