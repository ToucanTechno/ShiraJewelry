import {Component, Input, OnInit} from '@angular/core';
import {SizeDetectorService, WindowSizeBreakpoint} from '../../size-detector.service';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-tabbed-subcategories',
  templateUrl: './tabbed-subcategories.component.html',
  styleUrls: ['./tabbed-subcategories.component.scss']
})
export class TabbedSubcategoriesComponent implements OnInit {
  @Input()
  categoryColumns: number;

  constructor() { }

  ngOnInit(): void {
  }

}
