import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHotelComponent } from './view-hotel.component';

describe('ViewHotelComponent', () => {
  let component: ViewHotelComponent;
  let fixture: ComponentFixture<ViewHotelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewHotelComponent]
    });
    fixture = TestBed.createComponent(ViewHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
