import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CreateReservationPayload } from 'src/app/shared/services/reservation/models/create-reservation-payload';
import * as uuid from 'uuid';
import { Reservation } from './models/reservation';
import { EmailService } from '../email/interfaces/email.service';
import { Guest } from './models/guest';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  reservations$: BehaviorSubject<Reservation[]> = new BehaviorSubject<Reservation[]>([]);
  get mockedReservations(): Reservation[] {
    return this.reservations$.value;
  }

  constructor(
    private readonly emailService: EmailService,
  ) {
    // Using local storage to mock storing reservation in a database
    const storedReservationsString = localStorage.getItem("reservations");
    if(storedReservationsString) {
      const reservationsJson: any[] = JSON.parse(storedReservationsString);
      const reservations = reservationsJson.map(reservation => ({
        ...reservation,
        arrivalDate: new Date(reservation.arrivalDate),
        departDate: new Date(reservation.departDate),
      }));
      this.reservations$.next(reservations);
    }
    this.reservations$.subscribe((currentReservations) => {
      const reservationsJsonString = JSON.stringify(currentReservations);
      localStorage.setItem("reservations", reservationsJsonString);
    });
  }

  getRoomReservations(id: string) {
    return this.mockedReservations.filter(reservation => reservation.roomId == id);
  }

  async createReservation(hotelName: string, roomId: string, data: CreateReservationPayload): Promise<boolean> {
    const isValid = this.validateReservationDates(roomId, data.arrivalDate, data.departDate);
    if(!isValid) {
      console.log("The reservation is not valid");
      return false;
    }
    
    const reservation: Reservation = {
      id: uuid.v4(),
      ...data,
      roomId,
    };
    const updatedReservations = this.mockedReservations.concat(reservation);
    this.reservations$.next(updatedReservations);
    const firstGuest = reservation.guests.find(_ => true) as Guest;
    this.emailService.sendReservationEmail({
      hotel_name: hotelName,
      to_name: `${firstGuest.firstName} ${firstGuest.lastName}`,
      arrival_date: reservation.arrivalDate.toLocaleDateString(),
      message: `This email was sent to you because of a created reservation in a sample app, any information provided here or inside the app is fake and only used as a sample.`,
      to_email: firstGuest.email,
      reply_to: "jorgejgdrj41@gmail.com",
    });
    // Mocked result we assume errors never get triggered while adding a reservation.
    return true;
  }
  
  deleteRoomsReservations(roomsId: string[]) {
    const updatedReservations = this.mockedReservations.filter(reservation => !roomsId.includes(reservation.roomId));
    this.reservations$.next(updatedReservations);
  }

  validateReservationDates(roomId: string, arrivalDate?: Date, departDate?: Date): boolean {
    const roomReservations = this.getRoomReservations(roomId);
    const reservationFilters: ((reservation: Reservation) => boolean)[] = [];
    if(arrivalDate || departDate) {
      reservationFilters.push((reservation: Reservation) => {
        const arrivalBetween = !arrivalDate ? true : arrivalDate.getTime() < reservation.departDate.getTime() && arrivalDate.getTime() > reservation.arrivalDate.getTime();
        const departBetween = !departDate ? true : departDate.getTime() > reservation.arrivalDate.getTime() && departDate.getTime() < reservation.departDate.getTime();
        const reservationBetween = !(arrivalDate && departDate) ? true : arrivalDate.getTime() <= reservation.arrivalDate.getTime() && departDate.getTime() >= reservation.departDate.getTime();
        // Return true if the desired reservation doesnt have conflicts
        return !arrivalBetween && !departBetween && !reservationBetween;
      });
    }
    return roomReservations.every(reservation => {
      return reservationFilters.every(filter => filter(reservation));
    })
  }
}
