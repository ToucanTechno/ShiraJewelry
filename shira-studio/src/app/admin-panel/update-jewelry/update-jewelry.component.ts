import { Component, OnInit } from '@angular/core';
import {FileUploadService} from '../file-upload.service';
import crc32 from 'crc/crc32';
import {Observable, of} from 'rxjs';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';

// TODO: Put somewhere better, maybe in development environment
const API_SERVER_URL = 'http://localhost:3000';

@Component({
  selector: 'app-update-jewelry',
  templateUrl: './update-jewelry.component.html',
  styleUrls: ['./update-jewelry.component.scss']
})
export class UpdateJewelryComponent implements OnInit {
  uploadedFile: File = null;
  uploadedFileCrc: string = null;

  constructor(private fileUploadService: FileUploadService, private http: HttpClient) { }

  ngOnInit(): void {
  }

  handleFileInput(files: FileList): void {
    this.uploadedFileCrc = null;
    this.uploadedFile = files.item(0);
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
    console.log('Submitting form');
    this.uploadFile().subscribe((filename) => {
      console.log(filename);
      this.addProduct(productForm, filename);
    });
  }

  addProduct(productForm: NgForm, imagePath: string): void {
    console.log(productForm);
    this.http.post(API_SERVER_URL + '/products',
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
      .subscribe((res: FormResponse) => {
        console.log(res.insertedID);
        // TODO: Redirect somewhere better
      });
  }
}

interface FormResponse {
  insertedID: number;
}
