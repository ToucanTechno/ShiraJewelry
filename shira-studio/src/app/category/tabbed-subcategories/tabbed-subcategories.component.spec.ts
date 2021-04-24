import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabbedSubcategoriesComponent } from './tabbed-subcategories.component';

describe('TabbedSubcategoriesComponent', () => {
  let component: TabbedSubcategoriesComponent;
  let fixture: ComponentFixture<TabbedSubcategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabbedSubcategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabbedSubcategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
