import { HotelRoom } from "../../room/models/hotel-room";

export interface Hotel {
  id: string;
  name: string;
  country: string;
  address: string;
  rooms: HotelRoom[];
  enabled: boolean;
}