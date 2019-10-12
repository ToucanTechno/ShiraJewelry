import { BrowserModule } from '@angular/platform-browser';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BabylonEngineComponent } from './babylon-engine/babylon-engine.component';
import { ProductComponent } from './product/product.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ProductsComponent } from './products/products.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EmptyComponent } from './empty/empty.component';

const routes: Routes = [
  { path: '', component: BabylonEngineComponent, outlet: 'fluid', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'category/:category', component: ProductsComponent },
  { path: 'category/:category/:subcategory', component: ProductsComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: '', component: EmptyComponent }, // Here so that '' in default outlet won't redirect to not-found
  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  declarations: [
    AppComponent,
    BabylonEngineComponent,
    ProductComponent,
    HeaderComponent,
    AboutComponent,
    ProductsComponent,
    PageNotFoundComponent,
    EmptyComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
