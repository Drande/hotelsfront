import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelReservationViewComponent } from './hotel-reservation-view.component';

describe('HotelReservationViewComponent', () => {
  let component: HotelReservationViewComponent;
  let fixture: ComponentFixture<HotelReservationViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HotelReservationViewComponent]
    });
    fixture = TestBed.createComponent(HotelReservationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
