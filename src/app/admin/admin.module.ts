import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { PrimengModule } from '../primeng/primeng.module';

import { AdminComponent } from './admin.component';
import { HotelComponent } from './hotel/hotel.component';
import { AddHotelComponent } from './hotel/add-hotel/add-hotel.component';
import { ViewHotelComponent } from './hotel/view-hotel/view-hotel.component';
import { AddRoomComponent } from './hotel/add-room/add-room.component';
import { ViewRoomComponent } from './hotel/view-room/view-room.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    AdminComponent,
    HotelComponent,
    AddHotelComponent,
    ViewHotelComponent,
    AddRoomComponent,
    ViewRoomComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PrimengModule,
    SharedModule,
  ],
})
export class AdminModule { }
