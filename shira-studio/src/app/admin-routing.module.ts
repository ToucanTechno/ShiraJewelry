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
      { path: 'edit-item/:id', component: UpdateJewelryComponent, data: { type: 'edit' } },
      { path: 'add-item', component: UpdateJewelryComponent, data: { type: 'add' } },
      { path: 'edit-category/:category', component: JewelryListComponent, data: { type: 'edit' } },
      { path: 'add-category', component: JewelryListComponent, data: { type: 'add' } },
      { path: 'edit-categories', component: CategoriesListComponent },
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
