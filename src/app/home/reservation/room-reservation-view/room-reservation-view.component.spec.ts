import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomReservationViewComponent } from './room-reservation-view.component';

describe('RoomReservationViewComponent', () => {
  let component: RoomReservationViewComponent;
  let fixture: ComponentFixture<RoomReservationViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomReservationViewComponent]
    });
    fixture = TestBed.createComponent(RoomReservationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
