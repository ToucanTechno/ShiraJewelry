import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateJewelryComponent } from './update-jewelry.component';

describe('UpdateJewelryComponent', () => {
  let component: UpdateJewelryComponent;
  let fixture: ComponentFixture<UpdateJewelryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateJewelryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateJewelryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
