import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { DashboardComponent } from './admin-panel/dashboard/dashboard.component';
import {AdminRoutingModule} from './admin-routing.module';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {UpdateJewelryComponent} from './admin-panel/update-jewelry/update-jewelry.component';
import {UpdateCategoryComponent} from './admin-panel/update-category/update-category.component';
import {JewelryListComponent} from './admin-panel/jewelry-list/jewelry-list.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {HttpClientModule} from '@angular/common/http';
import {CategoriesListComponent} from './admin-panel/categories-list/categories-list.component';
import {MatTabsModule} from '@angular/material/tabs';
import { AlertComponent } from './admin-panel/alert/alert.component';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [
    AdminPanelComponent,
    DashboardComponent,
    UpdateJewelryComponent,
    UpdateCategoryComponent,
    JewelryListComponent,
    CategoriesListComponent,
    AlertComponent
  ],
    imports: [
      BrowserModule,
      RouterModule,
      AdminRoutingModule,
      BrowserAnimationsModule,
      FormsModule,
      MatToolbarModule,
      MatMenuModule,
      MatIconModule,
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatTableModule,
      MatPaginatorModule,
      MatCheckboxModule,
      HttpClientModule,
      MatTabsModule,
      MatDialogModule
    ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ],
  bootstrap: [AdminPanelComponent]
})
export class AdminModule { }
