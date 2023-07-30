import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { HotelComponent } from './hotel/hotel.component';
import { ViewHotelComponent } from './hotel/view-hotel/view-hotel.component';
import { ViewRoomComponent } from './hotel/view-room/view-room.component';

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      {
        path: "hotels",
        component: HotelComponent,
      },
      {
        path: "hotels/:hotelId",
        component: ViewHotelComponent,
      },
      {
        path: "rooms/:roomId",
        component: ViewRoomComponent,
      },
      {
        path: "**",
        redirectTo: "hotels"
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
