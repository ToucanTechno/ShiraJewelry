import { Component, OnInit } from '@angular/core';
import {SizeDetectorService, WindowSizeBreakpoint} from '../size-detector.service';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categoryColumns: number;

  constructor(private sizeDetectorService: SizeDetectorService) { }

  ngOnInit(): void {
    this.categoryColumns = this.windowBreakpointToColumns(this.sizeDetectorService.getCurrentSizeBreakpoint());
    this.sizeDetectorService.onResize$.subscribe((windowSizeBreakpoint: number) => {
      this.categoryColumns = this.windowBreakpointToColumns(windowSizeBreakpoint);
    });
  }


  windowBreakpointToColumns(windowSizeBreakpoint: WindowSizeBreakpoint): number {
    switch (windowSizeBreakpoint) {
      case WindowSizeBreakpoint.xs:
      case WindowSizeBreakpoint.sm:
        return 4;
      case WindowSizeBreakpoint.md:
        return 6;
      case WindowSizeBreakpoint.lg:
        return 8;
      case WindowSizeBreakpoint.xl:
      case WindowSizeBreakpoint.xxl:
        return 10;
      default:
        throwError('Invalid window size breakpoint: ' + windowSizeBreakpoint);
    }
  }
}
