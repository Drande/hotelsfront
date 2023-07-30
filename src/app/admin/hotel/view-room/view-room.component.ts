import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Assets } from 'src/app/app.assets';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotelRoom } from 'src/app/shared/services/room/models/hotel-room';
import { roomTypesNames, roomTypes, RoomTypes } from 'src/app/shared/services/room/models/room-type.enum';
import { RoomService } from 'src/app/shared/services/room/room.service';
import { CreateHotelRoomPayload } from 'src/app/shared/services/room/models/create-hotel-room-payload';

@Component({
  selector: 'app-view-room',
  templateUrl: './view-room.component.html',
  styleUrls: ['./view-room.component.scss']
})
export class ViewRoomComponent {
  columns = [
    {
      header: "Arrival",
      field: "arrivalDate",
      type: "date",
    },
    {
      header: "Depart",
      field: "departDate",
      type: "date",
    },
    {
      header: "Number of guests",
      field: "guests",
      type: "count",
    },
  ];
  onDestroy$: Subject<void> = new Subject();
  roomTypesNames = roomTypesNames;
  roomTypes = roomTypes;
  imageUrl = Assets.noImageFoundSvg;
  room!: HotelRoom;
  editing: boolean = false;
  roomForm = new FormGroup({
    cost: new FormControl<number>(50, { nonNullable: true, validators: [Validators.min(0)] }),
    tax: new FormControl<number>(6, { nonNullable: true, validators: [Validators.min(0)] }),
    type: new FormControl<RoomTypes>(RoomTypes.small, { nonNullable: true, validators: [Validators.required] }),
    capacity: new FormControl<number>(2, { nonNullable: true, validators: [Validators.min(1)] }),
    location: new FormControl<string>("", { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
  });

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly roomService: RoomService,
  ) {
    const roomId: string = this.route.snapshot.params["roomId"];
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

  submitEdits() {
    const { cost, tax, type, capacity, location } = this.roomForm.getRawValue();
    const roomData: CreateHotelRoomPayload = { cost, tax, type, capacity, location };
    this.roomService.updateRoom(this.room.id, roomData);
    this.editing = false;
  }

  viewRoom(room: HotelRoom) {
    this.router.navigate([`/admin/rooms/${room.id}`]);
  }

  enableEdit() {
    this.roomForm.patchValue({
      ...this.room
    });
    this.editing = true;
  }

  toggleRoomState() {
    this.roomService.updateRoom(this.room.id, { enabled: !this.room.enabled });
  }

  cancelEdit() {
    this.editing = false;
  }

  returnToHotelView() {
    this.router.navigate([`/admin/hotels/${this.room.hotelId}`]);
  }
}
