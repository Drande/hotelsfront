import { Injectable } from '@angular/core';
import * as uuid from 'uuid';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { CreateHotelRoomPayload } from './models/create-hotel-room-payload';
import { HotelRoom } from './models/hotel-room';
import { ReservationService } from '../reservation/reservation.service';
import { SearchRoomRequest } from './models/search-room-request';

@Injectable(
  { providedIn: 'root' }
)
export class RoomService {
  rooms$: BehaviorSubject<HotelRoom[]> = new BehaviorSubject<HotelRoom[]>([]);
  get mockedRooms(): HotelRoom[] {
    return this.rooms$.value;
  }

  constructor(
    private readonly reservationService: ReservationService,
  ) {
    // Using local storage to mock storing rooms in a database
    const storedRoomsString = localStorage.getItem("rooms");
    if(storedRoomsString) {
      const rooms = JSON.parse(storedRoomsString);
      this.rooms$.next(rooms);
    }
    this.rooms$.subscribe((currentRooms) => {
      const roomsJsonString = JSON.stringify(currentRooms);
      localStorage.setItem("rooms", roomsJsonString);
    });
    this.reservationService.reservations$.subscribe(_ => {
      // Refresh rooms simulating a cache invalidation
      this.refresh();
    });
  }

  getHotelRoom(roomId: string): Observable<HotelRoom> {
    return this.rooms$.asObservable()
      .pipe(
        map(rooms => {
          return rooms.find(room => room.id === roomId) as HotelRoom;
        }),
        filter(room => !!room),
        map((room: HotelRoom) => {
          const reservations = this.reservationService.getRoomReservations(room.id);
          room.reservations = reservations;
          return room;
        }),
      );
  }

  getHotelRooms(id: string): HotelRoom[] {
    return this.mockedRooms.filter(room => room.hotelId === id)
      .map(room => {
        const reservations = this.reservationService.getRoomReservations(room.id);
        room.reservations = reservations;
        return room;
      });
  }

  getAvailableHotelRooms(hotelId: string, searchRequest: SearchRoomRequest): HotelRoom[] {
    const { arrivalDate, departDate, numberOfGuests } = searchRequest;
    const roomFilters = [
      (room: HotelRoom) => room.hotelId === hotelId && room.enabled,
    ];

    if(numberOfGuests && numberOfGuests > 1) {
      roomFilters.push((room: HotelRoom) => room.capacity >= numberOfGuests);
    }

    return this.mockedRooms.filter(room => {
      const doesntHaveReservationConflicts = this.reservationService.validateReservationDates(room.id, arrivalDate, departDate);
      return roomFilters.every(roomFilter => roomFilter(room)) && doesntHaveReservationConflicts;
    });
  }

  async updateRoom(id: string, data: Partial<Omit<Omit<HotelRoom, 'id'>, 'hotelId'>>) {
    const updatedRooms = this.mockedRooms.map(room => {
      if(room.id === id) {
        room = { ...room, ...data, id };
      }
      return room;
    });
    this.rooms$.next(updatedRooms);
    return true;
  }

  async createRoom(hotelId: string, data: CreateHotelRoomPayload): Promise<boolean> {
    const newRoom: HotelRoom = { id: uuid.v4(), ...data, enabled: false, hotelId: hotelId, reservations: [] };
    const updatedRooms = this.mockedRooms.concat(newRoom);
    this.rooms$.next(updatedRooms);
    // Mocked result we assume errors never get triggered while adding a room.
    return true;
  }

  deleteHotelRooms(id: string) {
    const updatedRooms = this.mockedRooms.filter(room => room.hotelId !== id);
    const deletedRooms = this.mockedRooms.filter(room => room.hotelId === id).map(room => room.id);
    this.reservationService.deleteRoomsReservations(deletedRooms);
    this.rooms$.next(updatedRooms);
  }

  async refresh() {
    this.rooms$.next([ ...this.mockedRooms ]);
  }
}
