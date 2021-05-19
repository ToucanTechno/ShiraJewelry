import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';

const API_SERVER_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  postFile(file: File, fileCrc: string): Observable<string> {
    const format = file.type.split('/')[1];
    const filename = fileCrc + '.' + format;
    const endpoint = API_SERVER_URL + '/upload';
    const formData: FormData = new FormData();
    formData.append('productImage', file, filename);
    // TODO: base64 encode
    formData.append('lastModified', file.lastModified.toString());
    // TODO: base64 encode
    formData.append('size', file.size.toString());
    formData.append('format', format);
    return this.http.post(endpoint, formData, { responseType: 'text' })
      .pipe(map(() => filename))
      .pipe(catchError((e) => of(this.handleError(e))));
  }

  handleError(e): string{
    console.log(e);
    return null;
  }
}
