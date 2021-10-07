import {Component, Input, OnInit} from '@angular/core';
import {Currency, ProductEntry} from '../../models/product';

@Component({
  selector: 'app-display-grid',
  templateUrl: './display-grid.component.html',
  styleUrls: ['./display-grid.component.scss']
})
export class DisplayGridComponent implements OnInit {
  @Input()
  categoryColumns: number;
  @Input()
  products: ProductEntry[];
  @Input()
  ourPicks: ProductEntry[];

  constructor() { }

  ngOnInit(): void {
  }

  public get currency(): typeof Currency {
    return Currency;
  }
}
