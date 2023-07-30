import { Reservation } from "./reservation";

export interface CreateReservationPayload extends Omit<Omit<Reservation, 'id'>, 'roomId'> {

}