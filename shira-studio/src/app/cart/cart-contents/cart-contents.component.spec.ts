import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartContentsComponent } from './cart-contents.component';

describe('CartContentsComponent', () => {
  let component: CartContentsComponent;
  let fixture: ComponentFixture<CartContentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartContentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
