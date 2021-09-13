import {Component, Input, OnInit} from '@angular/core';
import {SizeDetectorService, WindowSizeBreakpoint} from '../../size-detector.service';
import {throwError} from 'rxjs';
import {Category} from '../../models/category';
import {Currency} from '../../models/product';

@Component({
  selector: 'app-tabbed-subcategories',
  templateUrl: './tabbed-subcategories.component.html',
  styleUrls: ['./tabbed-subcategories.component.scss']
})
export class TabbedSubcategoriesComponent {
  @Input()
  categoryColumns: number;
  @Input()
  subcategories: Category[];

  constructor() { }

  public get currency(): typeof Currency {
    return Currency;
  }
}
