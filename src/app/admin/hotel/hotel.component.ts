import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { AddHotelComponent } from './add-hotel/add-hotel.component';
import { CreateHotelPayload } from '../../shared/services/hotel/models/create-hotel-payload';
import { Table } from 'primeng/table';
import { FilterMatchMode } from 'primeng/api';
import { Router } from '@angular/router';
import { HotelService } from 'src/app/shared/services/hotel/hotel.service';
import { Hotel } from 'src/app/shared/services/hotel/models/hotel';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.scss']
})
export class HotelComponent implements OnInit, OnDestroy {
  onDestroy$: Subject<void> = new Subject();
  columns = [
    {
      header: "Name",
      field: "name",
      type: "string",
    },
    {
      header: "Country",
      field: "country",
      type: "string",
    },
    {
      header: "Address",
      field: "address",
      type: "string",
    },
    {
      header: "Enabled",
      field: "enabled",
      type: "boolean",
    }
  ];
  filterFields: string[] = this.columns.map(column => column.field);

  hotels: Hotel[] = [];

  constructor(
    private readonly router: Router,
    private readonly hotelService: HotelService,
    private readonly dialogService: DialogService,
  ) {
    this.hotelService.getHotels()
    .pipe(
      takeUntil(this.onDestroy$),
    ).subscribe((hotels) => {
      this.hotels = hotels;
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  applyGlobalFilter(event: Event, table: Table) {
    const element: HTMLInputElement = event.target as HTMLInputElement;
    const value = element.value;
    table.filterGlobal(value, FilterMatchMode.CONTAINS);
  }

  createHotel() {
    const ref = this.dialogService.open(AddHotelComponent,
      {
        header: "New hotel",
        styleClass: "responsive-dialog",
      }
    );
    ref.onClose
      .pipe(
        takeUntil(this.onDestroy$),
        take(1),
      ).subscribe((data?: CreateHotelPayload) => {
        if(!data) return;
        this.hotelService.createHotel(data);
      });
  }

  toggleHotelState(hotel: Hotel) {
    this.hotelService.updateHotel(hotel.id, { enabled: !hotel.enabled });
  }

  viewHotel(hotel: Hotel) {
    this.router.navigate([`/admin/hotels/${hotel.id}`]);
  }

  deleteHotel(hotel: Hotel) {
    this.hotelService.deleteHotel(hotel.id);
  }
}
