import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DocumentTypes, documentTypes } from 'src/app/constants/document-types.enum';
import Genders from 'src/app/constants/genders';
import { CreateReservationPayload } from 'src/app/shared/services/reservation/models/create-reservation-payload';
import { Reservation } from 'src/app/shared/services/reservation/models/reservation';
import { HotelRoom } from 'src/app/shared/services/room/models/hotel-room';
import { SearchRoomRequest } from 'src/app/shared/services/room/models/search-room-request';

@Component({
  selector: 'app-add-reservation',
  templateUrl: './add-reservation.component.html',
  styleUrls: ['./add-reservation.component.scss']
})
export class AddReservationComponent {
  genders = Genders;
  documentTypes = documentTypes;
  room: HotelRoom;

  get newGuestForm() {
    return new FormGroup({
      firstName: new FormControl<string>("", { nonNullable: true, validators: [ Validators.required ] }),
      lastName: new FormControl<string>("", { nonNullable: true, validators: [ Validators.required ] }),
      birthDate: new FormControl<string>("", { nonNullable: true, validators: [ Validators.required ] }),
      gender: new FormControl<string>("", { nonNullable: true, validators: [ Validators.required ] }),
      documentType: new FormControl<DocumentTypes>(DocumentTypes.id, { nonNullable: true, validators: [ Validators.required ] }),
      documentNumber: new FormControl<string>("", { nonNullable: true, validators: [ Validators.required ] }),
      email: new FormControl<string>("", { nonNullable: true, validators: [ Validators.required, Validators.email ] }),
      phoneNumber: new FormControl<string>("", { nonNullable: true, validators: [ Validators.required ] }),
    });
  }

  get guestForms() {
    return this.reservationForm.controls.guests;
  }

  reservationForm = new FormGroup({
    arrivalDate: new FormControl<Date>(new Date(), { nonNullable: true, validators: [ Validators.required ] }),
    departDate: new FormControl<Date>(new Date(), { nonNullable: true, validators: [ Validators.required ] }),
    guests:  new FormArray([ this.newGuestForm ]),
    emergencyContact: new FormGroup({
      firstName: new FormControl<string>("", { nonNullable: true, validators: [ Validators.required ] }),
      lastName: new FormControl<string>("", { nonNullable: true, validators: [ Validators.required ] }),
      phoneNumber: new FormControl<string>("", { nonNullable: true, validators: [ Validators.required ] }),
    })
  })

  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
  ) {
    const room: HotelRoom = this.config.data.room;
    this.room = room;
    const request: SearchRoomRequest = this.config.data.request;
    const { arrivalDate, departDate, numberOfGuests } = request;
    if(numberOfGuests && numberOfGuests < 5) {
      const guestsControl = this.reservationForm.controls.guests;
      while(guestsControl.length < numberOfGuests) {
        guestsControl.push(this.newGuestForm);
      }
    }
    this.reservationForm.patchValue({
      arrivalDate: !!arrivalDate ? arrivalDate : new Date(),
      departDate: !!departDate ? departDate : new Date(),
    });
  }

  confirmReservationDate() {

  }

  addGuest() {
    this.reservationForm.controls.guests.push(this.newGuestForm);
  }

  removeGuest(index: number) {
    this.reservationForm.controls.guests.removeAt(index);
  }

  submitForm() {
    const reservation: CreateReservationPayload = {
      ...this.reservationForm.getRawValue(),
    };
    this.ref.close(reservation);
  }

  close() {
    this.ref.close();
  }
}
