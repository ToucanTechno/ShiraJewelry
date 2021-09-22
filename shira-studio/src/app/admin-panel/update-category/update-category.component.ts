import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../file-upload.service';
import { HttpClient } from '@angular/common/http';
import crc32 from 'crc/crc32';
import {Observable, of} from 'rxjs';
import {NgForm} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss']
})
export class UpdateCategoryComponent implements OnInit {
  uploadedFile: File = null;
  uploadedFileCrc: string = null;

  constructor(private fileUploadService: FileUploadService,
              private http: HttpClient,
              private route: Router) { }

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

  onSubmit(categoryForm: NgForm): void {
    console.log('Submitting form');
    this.uploadFile().subscribe((filename) => {
      console.log(filename);
      this.addCategory(categoryForm, filename);
    });
  }

  addCategory(categoryForm: NgForm, imagePath: string): void {
    console.log(categoryForm);
    let route = this.route;
    this.http.post(environment.API_SERVER_URL + '/categories',
      {
        name: categoryForm.form.value.category_name,
        description_he: categoryForm.form.value.description,
        description_en: categoryForm.form.value.description,
        display_name_he: categoryForm.form.value.category_name,
        display_name_en: categoryForm.form.value.category_name,
        parent_category_name: categoryForm.form.value.category,
        image_path: imagePath,
      }, { responseType: 'json' })
      .pipe(catchError((e) => of(console.log(e))))
      .subscribe((res: CategoryFormResponse) => {
        console.log(res.insertedID);
        // TODO: Redirect somewhere better
        route.navigate(['/admin']);
      });
  }
}

interface CategoryFormResponse {
  insertedID: number;
}
