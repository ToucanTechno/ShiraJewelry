import { Component, OnInit } from '@angular/core';
import {FileUploadService} from '../file-upload.service';
import crc32 from 'crc/crc32';
import {Observable, of} from 'rxjs';
import {NgForm} from '@angular/forms';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductEntry} from '../../models/product';
import {CategoryEntry} from '../../models/category';
import {AlertComponent} from '../alert/alert.component';
import {MatDialog} from '@angular/material/dialog';

// TODO: Put somewhere better, maybe in development environment

@Component({
  selector: 'app-update-jewelry',
  templateUrl: './update-jewelry.component.html',
  styleUrls: ['./update-jewelry.component.scss']
})
export class UpdateJewelryComponent implements OnInit {
  title = '';
  routeType = '';
  editedProductData: ProductEntry = new ProductEntry();
  uploadedFile: File = null;
  uploadedFileCrc: string = null;
  uploadedFileURL: string = null;
  dbCategories$: Observable<CategoryEntry[]>;
  dbSelectedCategories = [];

  constructor(private fileUploadService: FileUploadService,
              private http: HttpClient,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog) {
    this.routeType = this.route.snapshot.data.type;
    switch (this.routeType) {
      case 'add':
        this.title = 'Add a Product';
        break;
      case 'edit':
        this.title = 'Edit a Product';
        break;
      default:
        console.log('Invalid route data type: ', this.routeType);
    }

    if (this.routeType === 'edit') {
      // Get entry from DB
      const productID = parseInt(this.route.snapshot.params.product, 10);
      this.http.get<ProductEntry>(environment.API_SERVER_URL + '/products/' + productID).subscribe({
        next: (data) => {
          this.editedProductData = data;
          this.dbSelectedCategories = data.parentCategories.map(category => category.id);
          console.log(data.parentCategories);
        },
        error: (error) => console.error(error)
      });
    }
  }

  ngOnInit(): void {
    this.dbCategories$ = this.http.get<CategoryEntry[]>(environment.API_SERVER_URL + '/categories');
  }

  handleFileInput(files: FileList): void {
    this.uploadedFileCrc = null;
    this.uploadedFileURL = null;
    if (files.length === 0) {  // Upon cancel
      return;
    }
    this.uploadedFile = files.item(0);
    // Illegal file, avoid accessing it in the future, TODO: add uploaded files security
    if (this.uploadedFile.type.match(/image\/*/) == null) {
      files = new FileList();
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.uploadedFile);
    reader.onload = (event) => {
      this.uploadedFileURL = (reader.result as string);
    };

    this.uploadedFile.arrayBuffer().then((buf) => {
      this.uploadedFileCrc = crc32(buf).toString(16);
    });
  }

  uploadFile(): Observable<string> {
    if (this.uploadedFileCrc == null) {
      return null;
    }
    return this.fileUploadService.postFile(this.uploadedFile, this.uploadedFileCrc);
  }

  onSubmit(productForm: NgForm): void {
    // TODO: different behavior for edit and add
    switch (this.routeType) {
      case 'add':
        this.uploadFile().subscribe((filename) => {
          this.addProduct(productForm, filename);
        });
        break;
      case 'edit':
        if (this.uploadedFileCrc != null) {
          this.uploadFile().subscribe((filename) => {
            this.editProduct(productForm, filename);
          });
        }
        else {
          this.editProduct(productForm);
        }
        break;
    }
  }

  addProduct(productForm: NgForm, imagePath: string): void {
    this.http.post(environment.API_SERVER_URL + '/products',
      {
        name: productForm.form.value.product_name,
        description_he: productForm.form.value.description,
        description_en: productForm.form.value.description,
        display_name_he: productForm.form.value.product_name,
        display_name_en: productForm.form.value.product_name,
        image_path: imagePath,
        price: productForm.form.value.price
      }, { responseType: 'json' })
      .pipe(catchError((e) => of(console.log(e))))
      .subscribe((res: ProductFormResponse) => {
        console.log(res.insertedID);
        // TODO: Redirect somewhere better
      });
  }

  editProduct(productForm: NgForm, imagePath?: string): void {
    console.log(productForm);
    this.http.put(environment.API_SERVER_URL + '/products/' + parseInt(this.route.snapshot.params.product, 10),
      {
        name: productForm.form.value.product_name,
        description_he: productForm.form.value.description_he,
        description_en: productForm.form.value.description,
        display_name_he: productForm.form.value.product_name_he,
        display_name_en: productForm.form.value.product_name,
        parent_category_ids: productForm.form.value.parent_categories, // TODO: make sure empty category stays empty
        image_path: (imagePath) ? imagePath : this.editedProductData.imagePath,
        price: productForm.form.value.price,
        stock: productForm.form.value.stock
      }, { responseType: 'json' })
      .pipe(catchError((e) => of(e)))
      .subscribe(async (res: ProductEditFormResponse | HttpErrorResponse) => {
        if (res instanceof HttpErrorResponse) {
          this.dialog.open(AlertComponent, {data: {message: `Request to server failed: ${res.status}`}});
          return;
        }
        // TODO: alert that it changed, also if parent categories changed!
        const message = (res.affectedItemsCount === 0) ? 'Product didn\'t change' : 'Product changed successfully';
        const dialogRef = this.dialog.open(AlertComponent, {data: {message}});
        await dialogRef.afterClosed().subscribe((e) => {
          this.router.navigate(['/admin', 'edit-products']);
        });
      });
  }

  getEditedImagePath(): string {
    if (this.uploadedFileURL !== null) {
      return this.uploadedFileURL;
    }
    if (this.routeType !== 'edit') {
      return '';
    }
    let imagePath = this.editedProductData.imagePath;
    imagePath = (imagePath === undefined) ? '' : '/product_images/' + imagePath;
    return imagePath;
  }
}

interface ProductFormResponse {
  insertedID: number;
}

interface ProductEditFormResponse {
  affectedItemsCount: number;
}
