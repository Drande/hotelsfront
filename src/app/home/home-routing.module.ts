import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ReservationComponent } from './reservation/reservation.component';
import { HotelReservationViewComponent } from './reservation/hotel-reservation-view/hotel-reservation-view.component';
import { RoomReservationViewComponent } from './reservation/room-reservation-view/room-reservation-view.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    children: [
      {
        path: "reservations",
        component: ReservationComponent,
      },
      {
        path: "reservations/hotel/:hotelId",
        component: HotelReservationViewComponent,
      },
      {
        path: "reservations/room/:roomId",
        component: RoomReservationViewComponent,
      },
      {
        path: "**",
        redirectTo: "reservations"
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
