import { Component, OnInit } from '@angular/core';
import {FileUploadService} from '../file-upload.service';
import crc32 from 'crc/crc32';
import {Observable, of} from 'rxjs';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {CategoryEntry} from '../../models/category';

// TODO: Put somewhere better, maybe in development environment

@Component({
  selector: 'app-update-jewelry',
  templateUrl: './update-jewelry.component.html',
  styleUrls: ['./update-jewelry.component.scss']
})
export class UpdateJewelryComponent implements OnInit {
  uploadedFile: File = null;
  uploadedFileCrc: string = null;
  uploadedFileURL: string = null;
  dbCategories$: Observable<CategoryEntry[]>;

  constructor(private fileUploadService: FileUploadService, private http: HttpClient) { }

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
    this.uploadFile().subscribe((filename) => {
      console.log(filename);
      this.addProduct(productForm, filename);
    });
  }

  addProduct(productForm: NgForm, imagePath: string): void {
    console.log(productForm);
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
}

interface ProductFormResponse {
  insertedID: number;
}
