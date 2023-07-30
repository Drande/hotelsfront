import { Reservation } from "../../reservation/models/reservation";
import { RoomTypes } from "./room-type.enum";

export interface HotelRoom {
  id: string;
  hotelId: string;
  cost: number;
  tax: number;
  type: RoomTypes;
  location: string;
  enabled: boolean;
  capacity: number;
  reservations: Reservation[];
}