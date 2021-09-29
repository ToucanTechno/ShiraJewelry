import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {CategoryEntry} from '../../models/category';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection: SelectionModel<CategoryEntry>;
  dataSource: MatTableDataSource<CategoryEntry> = new MatTableDataSource<CategoryEntry>();
  categoriesTableColumns = ['select', 'id', 'displayNameEN', 'displayNameHE', 'imagePath', 'actions'];

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    // TODO: move the get request earlier
    this.http.get<CategoryEntry[]>(environment.API_SERVER_URL + '/categories').subscribe({
      next: (data: CategoryEntry[]) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        const initialSelection = [];
        const allowMultiSelect = true;
        this.selection = new SelectionModel<CategoryEntry>(allowMultiSelect, initialSelection);
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
