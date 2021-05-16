import { Component, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-jewelry-list',
  templateUrl: './jewelry-list.component.html',
  styleUrls: ['./jewelry-list.component.scss']
})
export class JewelryListComponent implements OnInit {

  selection: SelectionModel<JewelryEntry>;
  jewelryList = [
    {id: 1, name: 'hello', price: 123, image: 'b'},
    {id: 2, name: 'what', price: 9191919, image: 'a'}
  ];
  jewelryTableColumns = ['select', 'id', 'name', 'price', 'image'];

  constructor() {
    const initialSelection = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<JewelryEntry>(allowMultiSelect, initialSelection);
  }

  ngOnInit(): void {
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.jewelryList.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.jewelryList.forEach(row => this.selection.select(row));
  }
}

class JewelryEntry {
  id: number;
  name: string;
  price: number;
  image: string;
}
