import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Assets } from 'src/app/app.assets';
import { Subject, take, takeUntil } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Countries from 'src/app/constants/countries';
import { DialogService } from 'primeng/dynamicdialog';
import { AddRoomComponent } from '../add-room/add-room.component';
import { HotelRoom } from 'src/app/shared/services/room/models/hotel-room';
import { HotelService } from 'src/app/shared/services/hotel/hotel.service';
import { Hotel } from 'src/app/shared/services/hotel/models/hotel';
import { CreateHotelRoomPayload } from 'src/app/shared/services/room/models/create-hotel-room-payload';
import { roomTypesNames } from 'src/app/shared/services/room/models/room-type.enum';
import { CreateHotelPayload } from 'src/app/shared/services/hotel/models/create-hotel-payload';

@Component({
  selector: 'app-view-hotel',
  templateUrl: './view-hotel.component.html',
  styleUrls: ['./view-hotel.component.scss']
})
export class ViewHotelComponent implements OnDestroy {
  roomTypesNames = roomTypesNames;
  countries = Countries;
  onDestroy$: Subject<void> = new Subject();
  imageUrl = Assets.noImageFoundSvg;
  hotel!: Hotel;
  editing: boolean = false;
  hotelForm = new FormGroup({
    name: new FormControl<string>("", { nonNullable: true, validators: [Validators.required, Validators.maxLength(50)] }),
    country: new FormControl<string>("", { nonNullable: true, validators: [Validators.required] }),
    address: new FormControl<string>("", { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] }),
  });

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialogService: DialogService,
    private readonly hotelService: HotelService,
  ) {
    const hotelId: string = this.route.snapshot.params["hotelId"];
    this.hotelService.getHotel(hotelId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(hotel => {
        this.hotel = hotel;
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  submitEdits() {
    const { name, country, address } = this.hotelForm.getRawValue();
    const hotelData: CreateHotelPayload = { name, country, address };
    this.hotelService.updateHotel(this.hotel.id, hotelData);
    this.editing = false;
  }

  viewRoom(room: HotelRoom) {
    this.router.navigate([`/admin/rooms/${room.id}`]);
  }

  enableEdit() {
    this.hotelForm.patchValue({
      ...this.hotel
    });
    this.editing = true;
  }

  toggleHotelState() {
    this.hotelService.updateHotel(this.hotel.id, { enabled: !this.hotel.enabled });
  }

  cancelEdit() {
    this.editing = false;
  }

  addRoom() {
    const ref = this.dialogService.open(AddRoomComponent,
      {
        header: `New room for ${this.hotel.name}`,
        styleClass: "responsive-dialog",
      }
    );
    ref.onClose
      .pipe(
        takeUntil(this.onDestroy$),
        take(1),
      ).subscribe((data?: CreateHotelRoomPayload) => {
        if(!data) return;
        this.hotelService.addHotelRoom(this.hotel.id, data);
      });
  }

  returnToHotelsView() {
    this.router.navigate(["/admin/hotels"]);
  }
}
