import { ReservationEmailArgs } from "../models/reservation-email-args";

export abstract class EmailService {
  public abstract sendReservationEmail(args: ReservationEmailArgs): Promise<boolean>;
}