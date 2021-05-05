import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {CategoryComponent} from './category/category.component';
import {ProductComponent} from './product/product.component';
import {CartComponent} from './cart/cart.component';
import {SigninComponent} from './signin/signin.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'category', component: CategoryComponent},
  { path: 'product', component: ProductComponent},
  { path: 'cart', component: CartComponent},
  { path: 'login', component: SigninComponent},
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
export class AppRoutingModule {

}
