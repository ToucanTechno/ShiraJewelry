import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesPresentationComponent } from './categories-presentation.component';

describe('CategoriesPresentationComponent', () => {
  let component: CategoriesPresentationComponent;
  let fixture: ComponentFixture<CategoriesPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriesPresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
