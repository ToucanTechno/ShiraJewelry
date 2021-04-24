import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutArtistComponent } from './about-artist.component';

describe('AboutArtistComponent', () => {
  let component: AboutArtistComponent;
  let fixture: ComponentFixture<AboutArtistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutArtistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutArtistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
