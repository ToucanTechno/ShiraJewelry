import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewelryListComponent } from './jewelry-list.component';

describe('JewelryListComponent', () => {
  let component: JewelryListComponent;
  let fixture: ComponentFixture<JewelryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JewelryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JewelryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
