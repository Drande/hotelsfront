import { Guest } from "./guest";

export interface Reservation {
  id: string;
  roomId: string;
  arrivalDate: Date;
  departDate: Date;
  guests: Guest[];
  emergencyContact: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }
}