import { Component, OnDestroy } from '@angular/core';
import { Assets } from 'src/app/app.assets';
import { Hotel } from 'src/app/shared/services/hotel/models/hotel';
import { HotelService } from '../../../shared/services/hotel/hotel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { roomTypesNames } from 'src/app/shared/services/room/models/room-type.enum';
import { HotelRoom } from 'src/app/shared/services/room/models/hotel-room';
import { RoomService } from 'src/app/shared/services/room/room.service';
import { SearchHotelRequest } from 'src/app/shared/services/hotel/models/search-hotel-request';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-hotel-reservation-view',
  templateUrl: './hotel-reservation-view.component.html',
  styleUrls: ['./hotel-reservation-view.component.scss']
})
export class HotelReservationViewComponent implements OnDestroy {
  onDestroy$: Subject<void> = new Subject();
  imageUrl = Assets.noImageFoundSvg;
  roomTypesNames = roomTypesNames;
  hotel!: Hotel;
  availableRooms: HotelRoom[] = [];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly hotelService: HotelService,
    private readonly roomService: RoomService,
  ) {
    const { arrivalDate, departDate, globalSearch, numberOfGuests } = this.route.snapshot.queryParams;
    const searchFilters: SearchHotelRequest = {
      arrivalDate: new Date(arrivalDate),
      departDate: new Date(departDate),
      globalSearch,
      numberOfGuests
    };
    const hotelId: string = this.route.snapshot.params["hotelId"];
    this.hotelService.getHotel(hotelId)
    .pipe(takeUntil(this.onDestroy$))
    .subscribe((hotel) => {
      this.hotel = hotel;
    });
    this.availableRooms = this.roomService.getAvailableHotelRooms(hotelId, searchFilters);
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  viewRoom(room: HotelRoom) {
    this.router.navigate([`/home/reservations/room/${room.id}`], { queryParams: this.route.snapshot.queryParams });
  }

  returnToHotelList() {
    this.router.navigate([`/home/reservations`], { queryParams: this.route.snapshot.queryParams });
  }
}
