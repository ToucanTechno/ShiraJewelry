import { Component, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-jewelry-list',
  templateUrl: './jewelry-list.component.html',
  styleUrls: ['./jewelry-list.component.scss']
})
export class JewelryListComponent implements OnInit {

  selection: SelectionModel<JewelryEntry>[];
  jewelryList = [
    {id: '1', name: 'hello', price: 123, image: 'b'},
    {id: '2', name: 'what', price: 9191919, image: 'a'}
  ];
  jewelryTableColumns = ['select', 'id', 'name', 'price', 'image'];

  constructor() {
    const initialSelection = [];
    const allowMultiSelect = true;
    this.selection = new SelectionModel<JewelryEntry>(allowMultiSelect, initialSelection);
  }

  ngOnInit(): void {
  }

}

class JewelryEntry {
  id: number;
  name: string;
  price: number;
  image: string;
}
