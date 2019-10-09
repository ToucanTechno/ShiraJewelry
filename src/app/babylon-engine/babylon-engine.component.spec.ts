import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BabylonEngineComponent } from './babylon-engine.component';

describe('BabylonEngineComponent', () => {
  let component: BabylonEngineComponent;
  let fixture: ComponentFixture<BabylonEngineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BabylonEngineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BabylonEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
