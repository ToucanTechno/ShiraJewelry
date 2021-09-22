import { Component, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {

  selection: SelectionModel<CategoriesEntry>;
  categoriesList = [
    {id: 1, name: 'hello', image: '123.jpg'},
    {id: 2, name: 'what', image: '456.jpg'}
  ];
  categoriesTableColumns = ['select', 'id', 'categoryName', 'image', 'actions'];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const initialSelection = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<CategoriesEntry>(allowMultiSelect, initialSelection);
    this.categoriesList = this.http.get<CategoriesEntry[]>('http://localhost:3000/categories');
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.categoriesList.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.categoriesList.forEach(row => this.selection.select(row));
  }

}

class CategoriesEntry {
  id: number;
  name: string;
  image: string;
}
