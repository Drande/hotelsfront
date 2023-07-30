import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateHotelRoomPayload } from 'src/app/shared/services/room/models/create-hotel-room-payload';
import { roomTypes, RoomTypes } from 'src/app/shared/services/room/models/room-type.enum';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss']
})
export class AddRoomComponent {
  roomTypes = roomTypes;
  newRoomForm = new FormGroup({
    cost: new FormControl<number>(50, { nonNullable: true, validators: [Validators.min(0)] }),
    tax: new FormControl<number>(6, { nonNullable: true, validators: [Validators.min(0)] }),
    type: new FormControl<RoomTypes>(RoomTypes.small, { nonNullable: true, validators: [Validators.required] }),
    capacity: new FormControl<number>(2, { nonNullable: true, validators: [Validators.min(1)] }),
    location: new FormControl<string>("", { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
  });

  constructor(
    private readonly ref: DynamicDialogRef,
  ) {
    
  }

  submitForm() {
    const { cost, tax, type, capacity, location } = this.newRoomForm.getRawValue();
    const room: CreateHotelRoomPayload = { cost, tax, type, capacity, location };
    this.ref.close(room);
  }

  close() {
    this.ref.close();
  }
}
