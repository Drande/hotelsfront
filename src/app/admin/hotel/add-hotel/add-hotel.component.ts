import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateHotelPayload } from '../../../shared/services/hotel/models/create-hotel-payload';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import Countries from 'src/app/constants/countries';

@Component({
  selector: 'app-add-hotel',
  templateUrl: './add-hotel.component.html',
  styleUrls: ['./add-hotel.component.scss']
})
export class AddHotelComponent {
  countries = Countries;
  newHotelForm = new FormGroup({
    name: new FormControl<string>("", { nonNullable: true, validators: [Validators.required, Validators.maxLength(50)] }),
    country: new FormControl<string>("", { nonNullable: true, validators: [Validators.required] }),
    address: new FormControl<string>("", { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] }),
  });

  constructor(
    private readonly ref: DynamicDialogRef,
  ) {
    
  }

  submitForm() {
    const { name, country, address } = this.newHotelForm.getRawValue();
    const hotel: CreateHotelPayload = { name, country, address };
    this.ref.close(hotel);
  }

  close() {
    this.ref.close();
  }
}
