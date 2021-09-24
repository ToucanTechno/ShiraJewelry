import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection: SelectionModel<CategoriesEntry>;
  dataSource: MatTableDataSource<CategoriesEntry> = new MatTableDataSource<CategoriesEntry>();
  categoriesTableColumns = ['id', 'name']; //['select', 'id', 'categoryName', 'image', 'actions'];

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    // TODO: move the get request earlier
    this.http.get<CategoriesEntry[]>('http://localhost:3000/categories').subscribe({
      next: (data: CategoriesEntry[]) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        const initialSelection = [];
        const allowMultiSelect = true;
        this.selection = new SelectionModel<CategoriesEntry>(allowMultiSelect, initialSelection);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

}

class CategoriesEntry {
  id: number;
  name: string;
  descriptionHe: string;
  descriptionEn: string;
  displayNameHe: string;
  displayNameEn: string;
  imagePath: string;
  parentCategoryId: number;
  isVisible: string;
}
