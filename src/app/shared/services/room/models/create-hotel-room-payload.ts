import { RoomTypes } from "./room-type.enum";

export interface CreateHotelRoomPayload {
  cost: number;
  tax: number;
  type: RoomTypes;
  location: string;
  capacity: number;
}