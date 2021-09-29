import {Component, OnInit} from '@angular/core';
import { FileUploadService } from '../file-upload.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import crc32 from 'crc/crc32';
import {Observable, of} from 'rxjs';
import {NgForm} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryEntry} from '../../models/category';
import {MatDialog} from '@angular/material/dialog';
import {AlertComponent} from '../alert/alert.component';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss']
})
export class UpdateCategoryComponent implements OnInit {
  title = '';
  routeType = '';
  editedCategoryData: CategoryEntry = new CategoryEntry();
  // TODO: move file attributes and methods to a separate class
  uploadedFile: File = null;
  uploadedFileCrc: string = null;
  uploadedFileURL: string = null;
  dbCategories$: Observable<{}[]>;

  constructor(private fileUploadService: FileUploadService,
              private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog) {
    this.routeType = this.route.snapshot.data.type;
    switch (this.routeType) {
      case 'add':
        this.title = 'Add a Category';
        break;
      case 'edit':
        this.title = 'Edit a Category';
        break;
      default:
        console.log('Invalid route data type: ', this.routeType);
    }

    if (this.routeType === 'edit') {
      // Get entry from DB
      const categoryId = parseInt(this.route.snapshot.params.category, 10);
      this.http.get<CategoryEntry>(environment.API_SERVER_URL + '/categories/' + categoryId).subscribe({
        next: (data) => {
          this.editedCategoryData = data;
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

  onSubmit(categoryForm: NgForm): void {
    // TODO: different behavior for edit and add
    switch (this.routeType) {
      case 'add':
        this.uploadFile().subscribe((filename) => {
          this.addCategory(categoryForm, filename);
        });
        break;
      case 'edit':
        if (this.uploadedFileCrc != null) {
          this.uploadFile().subscribe((filename) => {
            this.editCategory(categoryForm, filename);
          })
        }
        else {
          this.editCategory(categoryForm);
        }
        break;
    }
  }

  addCategory(categoryForm: NgForm, imagePath: string): void {
    this.http.post(environment.API_SERVER_URL + '/categories',
      {
        name: categoryForm.form.value.category_name,
        description_he: categoryForm.form.value.description_he,
        description_en: categoryForm.form.value.description,
        display_name_he: categoryForm.form.value.category_name_he,
        display_name_en: categoryForm.form.value.category_name,
        parent_category_name: categoryForm.form.value.parent_category,
        image_path: imagePath,
      }, { responseType: 'json' })
      .pipe(catchError((e) => of(e)))
      .subscribe(async (res: CategoryAddFormResponse | HttpErrorResponse) => {
        if (res instanceof HttpErrorResponse) {
          this.dialog.open(AlertComponent, {data: {message: `Request to server failed: ${res.status}`}})
          return;
        }
        console.log(res.insertedID);
        const message = `Added ${categoryForm.form.value.category_name} successfully. Inserted ID is: ${res.insertedID}`;
        const dialogRef = this.dialog.open(AlertComponent, {data: {message}});
        await dialogRef.afterClosed().subscribe((e) => {
          this.router.navigate(['/admin']);
        });
      });
  }

  editCategory(categoryForm: NgForm, imagePath?: string): void {
    this.http.put(environment.API_SERVER_URL + '/categories/' + parseInt(this.route.snapshot.params.category, 10),
      {
        name: categoryForm.form.value.category_name,
        description_he: categoryForm.form.value.description_he,
        description_en: categoryForm.form.value.description,
        display_name_he: categoryForm.form.value.category_name_he,
        display_name_en: categoryForm.form.value.category_name,
        parent_category_name: categoryForm.form.value.parent_category, // TODO: make sure empty category stays empty
        image_path: (imagePath) ? imagePath : this.editedCategoryData.imagePath,
      }, { responseType: 'json' })
      .pipe(catchError((e) => of(e)))
      .subscribe(async (res: CategoryEditFormResponse | HttpErrorResponse) => {
        if (res instanceof HttpErrorResponse) {
          this.dialog.open(AlertComponent, {data: {message: `Request to server failed: ${res.status}`}})
          return;
        }
        const message = (res.affectedItemsCount === 0) ? 'Category didn\'t change' : 'Category changed successfully';
        const dialogRef = this.dialog.open(AlertComponent, {data: {message}});
        await dialogRef.afterClosed().subscribe((e) => {
          this.router.navigate(['/admin', 'edit-categories']);
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
    let imagePath = this.editedCategoryData.imagePath;
    imagePath = (imagePath === undefined) ? '' : '/product_images/' + imagePath;
    return imagePath;
  }
}

interface CategoryAddFormResponse {
  insertedID: number;
}

interface CategoryEditFormResponse {
  affectedItemsCount: number;
}
