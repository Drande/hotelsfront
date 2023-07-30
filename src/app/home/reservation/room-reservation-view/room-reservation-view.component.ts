import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, take, takeUntil } from 'rxjs';
import { Assets } from 'src/app/app.assets';
import { HotelRoom } from 'src/app/shared/services/room/models/hotel-room';
import { roomTypesNames } from 'src/app/shared/services/room/models/room-type.enum';
import { RoomService } from 'src/app/shared/services/room/room.service';
import { AddReservationComponent } from '../add-reservation/add-reservation.component';
import { SearchRoomRequest } from 'src/app/shared/services/room/models/search-room-request';
import { Reservation } from '../../../shared/services/reservation/models/reservation';
import { CreateReservationPayload } from 'src/app/shared/services/reservation/models/create-reservation-payload';
import { ReservationService } from 'src/app/shared/services/reservation/reservation.service';
import { HotelService } from 'src/app/shared/services/hotel/hotel.service';

@Component({
  selector: 'app-room-reservation-view',
  templateUrl: './room-reservation-view.component.html',
  styleUrls: ['./room-reservation-view.component.scss']
})
export class RoomReservationViewComponent implements OnDestroy {
  onDestroy$: Subject<void> = new Subject();
  imageUrl = Assets.noImageFoundSvg;
  roomTypesNames = roomTypesNames;
  room!: HotelRoom;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly hotelService: HotelService,
    private readonly roomService: RoomService,
    private readonly reservationService: ReservationService,
    private readonly dialogService: DialogService,
  ) {
    const roomId = this.route.snapshot.params["roomId"];
    this.roomService.getHotelRoom(roomId)
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(room => {
      this.room = room;
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  handleRoomReservation() {
    const { arrivalDate, departDate, numberOfGuests } = this.route.snapshot.queryParams;
    const searchFilters: SearchRoomRequest = {
      arrivalDate: arrivalDate && new Date(arrivalDate),
      departDate: departDate && new Date(departDate),
      numberOfGuests
    };
    const ref = this.dialogService.open(AddReservationComponent, {
      styleClass: "form-dialog",
      header: "Confirm reservation",
      data: {
        request: searchFilters,
        room: this.room,
      }
    });
    ref.onClose.pipe(
      takeUntil(this.onDestroy$),
      take(1)
    ).subscribe(async (data?: CreateReservationPayload) => {
      if(!data) return;
      const hotel = await this.hotelService.getHotelById(this.room.hotelId);
      if(!hotel) return;
      await this.reservationService.createReservation(hotel.name, this.room.id, data);
    });
  }

  returnToHotelView() {
    this.router.navigate([`/home/reservations/hotel/${this.room.hotelId}`], { queryParams: this.route.snapshot.queryParams });
  }
}
