export interface ReservationEmailArgs {
  hotel_name: string;
  to_name: string;
  arrival_date: string;
  message: string;
  to_email: string;
  reply_to: string;
}