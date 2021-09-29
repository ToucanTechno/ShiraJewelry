import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import { ProductEntry } from '../../models/product';

@Component({
  selector: 'app-jewelry-list',
  templateUrl: './jewelry-list.component.html',
  styleUrls: ['./jewelry-list.component.scss']
})
export class JewelryListComponent implements AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection: SelectionModel<ProductEntry>;
  dataSource: MatTableDataSource<ProductEntry> = new MatTableDataSource<ProductEntry>();
  productsTableColumns = ['select', 'id', 'displayNameEN', 'displayNameHE', 'imagePath', 'price', 'stock', 'actions'];

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    // TODO: move the get request earlier
    this.http.get<ProductEntry[]>(environment.API_SERVER_URL + '/products').subscribe({
      next: (data: ProductEntry[]) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        const initialSelection = [];
        const allowMultiSelect = true;
        this.selection = new SelectionModel<ProductEntry>(allowMultiSelect, initialSelection);
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
