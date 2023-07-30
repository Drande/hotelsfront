import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { PrimengModule } from '../primeng/primeng.module';

import { HomeComponent } from './home.component';
import { ReservationComponent } from './reservation/reservation.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HotelReservationViewComponent } from './reservation/hotel-reservation-view/hotel-reservation-view.component';
import { RoomReservationViewComponent } from './reservation/room-reservation-view/room-reservation-view.component';
import { AddReservationComponent } from './reservation/add-reservation/add-reservation.component';


@NgModule({
  declarations: [
    HomeComponent,
    ReservationComponent,
    HotelReservationViewComponent,
    RoomReservationViewComponent,
    AddReservationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    PrimengModule,
    SharedModule,
  ]
})
export class HomeModule { }
