import {Component, OnInit} from '@angular/core';
import {SizeDetectorService, WindowSizeBreakpoint} from '../size-detector.service';
import {throwError} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Category} from '../models/category';
import {Currency} from '../models/product';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categoryColumns: number;
  id: number;
  categoryContent: Category;

  constructor(private sizeDetectorService: SizeDetectorService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.categoryColumns = this.windowBreakpointToColumns(this.sizeDetectorService.getCurrentSizeBreakpoint());
    this.sizeDetectorService.onResize$.subscribe((windowSizeBreakpoint: number) => {
      this.categoryColumns = this.windowBreakpointToColumns(windowSizeBreakpoint);
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.categoryContent = {
      name: 'Category1',
      description: 'lorem ipsum',
      subcategories: [
        {
          name: 'Sub1',
          description: 'lorem ipsum',
          subcategories: [],
          products: [
            {id: 11, currency: Currency.USD, price: 13.34, imagePath: 'test_image1.jpg'},
            {id: 12, currency: Currency.USD, price: 23.34, imagePath: 'test_image1.jpg'},
            {id: 13, currency: Currency.USD, price: 33.34, imagePath: 'test_image1.jpg'},
            {id: 14, currency: Currency.USD, price: 43.34, imagePath: 'test_image1.jpg'},
            {id: 15, currency: Currency.USD, price: 53.34, imagePath: 'test_image1.jpg'},
            {id: 16, currency: Currency.USD, price: 63.34, imagePath: 'test_image1.jpg'},
            {id: 17, currency: Currency.USD, price: 73.34, imagePath: 'test_image1.jpg'},
            {id: 18, currency: Currency.USD, price: 83.34, imagePath: 'test_image1.jpg'},
            {id: 19, currency: Currency.USD, price: 93.34, imagePath: 'test_image1.jpg'},
            {id: 20, currency: Currency.USD, price: 103.34, imagePath: 'test_image1.jpg'}
          ],
          ourPicks: []
        },
        {
          name: 'Sub2',
          description: 'lorem ipsum',
          subcategories: [],
          products: [
            {id: 1, currency: Currency.USD, price: 12.34, imagePath: 'test_image1.jpg'},
            {id: 2, currency: Currency.USD, price: 22.34, imagePath: 'test_image1.jpg'},
            {id: 3, currency: Currency.USD, price: 32.34, imagePath: 'test_image1.jpg'},
            {id: 4, currency: Currency.USD, price: 42.34, imagePath: 'test_image1.jpg'},
            {id: 5, currency: Currency.USD, price: 52.34, imagePath: 'test_image1.jpg'},
            {id: 6, currency: Currency.USD, price: 62.34, imagePath: 'test_image1.jpg'},
            {id: 7, currency: Currency.USD, price: 72.34, imagePath: 'test_image1.jpg'},
            {id: 8, currency: Currency.USD, price: 82.34, imagePath: 'test_image1.jpg'},
            {id: 9, currency: Currency.USD, price: 92.34, imagePath: 'test_image1.jpg'},
            {id: 10, currency: Currency.USD, price: 102.34, imagePath: 'test_image1.jpg'}
          ],
          ourPicks: []
        }
      ],
      products: [
        {id: 21, currency: Currency.USD, price: 12.34, imagePath: 'test_image1.jpg'},
        {id: 22, currency: Currency.USD, price: 22.34, imagePath: 'test_image1.jpg'},
        {id: 23, currency: Currency.USD, price: 32.34, imagePath: 'test_image1.jpg'},
        {id: 24, currency: Currency.USD, price: 42.34, imagePath: 'test_image1.jpg'},
        {id: 25, currency: Currency.USD, price: 52.34, imagePath: 'test_image1.jpg'},
        {id: 26, currency: Currency.USD, price: 62.34, imagePath: 'test_image1.jpg'},
        {id: 27, currency: Currency.USD, price: 72.34, imagePath: 'test_image1.jpg'},
        {id: 28, currency: Currency.USD, price: 82.34, imagePath: 'test_image1.jpg'},
        {id: 29, currency: Currency.USD, price: 92.34, imagePath: 'test_image1.jpg'},
        {id: 30, currency: Currency.USD, price: 102.34, imagePath: 'test_image1.jpg'}],
      ourPicks: [
        {id: 21, currency: Currency.USD, price: 12.34, imagePath: 'test_image1.jpg'},
        {id: 22, currency: Currency.USD, price: 22.34, imagePath: 'test_image1.jpg'},
        {id: 23, currency: Currency.USD, price: 32.34, imagePath: 'test_image1.jpg'},
        {id: 24, currency: Currency.USD, price: 42.34, imagePath: 'test_image1.jpg'},
        {id: 25, currency: Currency.USD, price: 52.34, imagePath: 'test_image1.jpg'},
        {id: 26, currency: Currency.USD, price: 62.34, imagePath: 'test_image1.jpg'},
        {id: 27, currency: Currency.USD, price: 72.34, imagePath: 'test_image1.jpg'},
        {id: 28, currency: Currency.USD, price: 82.34, imagePath: 'test_image1.jpg'},
        {id: 29, currency: Currency.USD, price: 92.34, imagePath: 'test_image1.jpg'},
        {id: 30, currency: Currency.USD, price: 102.34, imagePath: 'test_image1.jpg'}
      ]
    };
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
