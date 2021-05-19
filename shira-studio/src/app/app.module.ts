import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AboutArtistComponent } from './home/about-artist/about-artist.component';
import { CategoriesPresentationComponent } from './home/categories-presentation/categories-presentation.component';
import { CategoryComponent } from './category/category.component';
import { TabbedSubcategoriesComponent } from './category/tabbed-subcategories/tabbed-subcategories.component';
import { DisplayGridComponent } from './category/display-grid/display-grid.component';
import { ProductComponent } from './product/product.component';
import { ProductDisplayComponent } from './product/product-display/product-display.component';
import { ProductDescriptionComponent } from './product/product-description/product-description.component';
import { CartComponent } from './cart/cart.component';
import { CartContentsComponent } from './cart/cart-contents/cart-contents.component';
import { PaymentCardComponent } from './cart/payment-card/payment-card.component';
import { SigninComponent } from './signin/signin.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { UpdateJewelryComponent } from './admin-panel/update-jewelry/update-jewelry.component';
import { CategoriesListComponent } from './admin-panel/categories-list/categories-list.component';
import { JewelryListComponent } from './admin-panel/jewelry-list/jewelry-list.component';
import { UpdateCategoryComponent } from './admin-panel/update-category/update-category.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AboutArtistComponent,
    CategoriesPresentationComponent,
    CategoryComponent,
    TabbedSubcategoriesComponent,
    DisplayGridComponent,
    ProductComponent,
    ProductDisplayComponent,
    ProductDescriptionComponent,
    CartComponent,
    CartContentsComponent,
    PaymentCardComponent,
    SigninComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatTabsModule,
    MatGridListModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
