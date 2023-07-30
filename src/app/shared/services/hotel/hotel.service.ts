import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import * as uuid from 'uuid';
import { CreateHotelRoomPayload } from '../room/models/create-hotel-room-payload';
import { RoomService } from '../room/room.service';
import { CreateHotelPayload } from './models/create-hotel-payload';
import { Hotel } from './models/hotel';
import { SearchHotelRequest } from './models/search-hotel-request';
import { HotelRoom } from '../room/models/hotel-room';

@Injectable(
  { providedIn: 'root' }
)
export class HotelService {
  hotels$: BehaviorSubject<Hotel[]> = new BehaviorSubject<Hotel[]>([]);
  get mockedHotels(): Hotel[] {
    return this.hotels$.value;
  }

  constructor(
    private readonly roomService: RoomService,
  ) {
    // Using local storage to mock storing hotels in a database
    const storedHotelsString = localStorage.getItem("hotels");
    if(storedHotelsString) {
      const hotels = JSON.parse(storedHotelsString);
      this.hotels$.next(hotels);
    }
    this.hotels$.subscribe((currentHotels) => {
      const hotelsJsonString = JSON.stringify(currentHotels);
      localStorage.setItem("hotels", hotelsJsonString);
    });
    this.roomService.rooms$.subscribe(_ => {
      // Refresh hotels simulating a cache invalidation
      this.refresh();
    });
  }

  async getHotelById(hotelId: string) {
    return this.mockedHotels.find(hotel => hotel.id === hotelId);
  }

  getHotel(id: string): Observable<Hotel> {
    return this.hotels$.asObservable()
      // Used to simulate a join from the database collections
      .pipe(map(this.populateHotelRooms))
      // Filter nulls
      .pipe(
        map(hotels => {
          return hotels.find(hotel => hotel.id === id);
        },
        filter(hotel => !!hotel)
      )) as Observable<Hotel>;
  }

  getHotels(): Observable<Hotel[]> {
    return this.hotels$.asObservable()
      // Used to simulate a join from the database collections
      .pipe(map(this.populateHotelRooms));
  }

  // getAvailableHotel(id: string, searchRequest: SearchHotelRequest): Observable<Hotel> {
  //   return this.hotels$.asObservable()
  //     // Used to simulate a join from the database collections
  //     .pipe(map(this.populateAvailableHotelRooms(searchRequest)))
  //     // Filter nulls
  //     .pipe(
  //       map(hotels => {
  //         return hotels.find(hotel => hotel.id === id);
  //       },
  //       filter(hotel => !!hotel)
  //     )) as Observable<Hotel>;
  // }

  // getAvailableHotels(searchRequest: SearchHotelRequest): Observable<Hotel[]> {
  //   return this.hotels$.asObservable()
  //     // Used to simulate a join from the database collections
  //     .pipe(map(this.populateAvailableHotelRooms(searchRequest)));
  // }

  populateHotelRooms = (hotels: Hotel[]) => {
    hotels = hotels.map(hotel => {
      hotel.rooms = this.roomService.getHotelRooms(hotel.id);
      return hotel;
    })
    return hotels;
  }

  // populateAvailableHotelRooms = (searchRequest: SearchHotelRequest) => (sample: Hotel[]) => {
  //   let hotels = [ ...sample ];
  //   console.log("base", [ ...hotels ]);
  //   console.log("filters", searchRequest);
  //   const { arrivalDate, departDate, globalSearch, numberOfGuests } = searchRequest;
  //   if(globalSearch) {
  //     hotels = hotels.filter(hotel => {
  //       const { name, country, address } = hotel;
  //       return `${name} ${country} ${address}`.includes(globalSearch);
  //     });
  //   }
  //   const roomFilters = [
  //     (room: HotelRoom) => room.enabled,
  //   ];

  //   if(numberOfGuests && numberOfGuests > 1) {
  //     roomFilters.push((room: HotelRoom) => room.capacity >= numberOfGuests);
  //   }
  //   if(arrivalDate && departDate) {
  //     roomFilters.push((room: HotelRoom) => room.reservations.every(reservation => {
  //       const arrivalBeforeDepart = arrivalDate.getTime() < reservation.departDate.getTime();
  //       const departAfterArrival = departDate.getTime() > reservation.arrivalDate.getTime();
  //       // Return true if the desired reservation doesnt have conflicts
  //       return !arrivalBeforeDepart && !departAfterArrival;
  //     }));
  //   }
  //   if(arrivalDate && !departDate) {
  //     roomFilters.push((room: HotelRoom) => room.reservations.every(reservation => {
  //       const arrivalAfterArrival = arrivalDate.getTime() > reservation.arrivalDate.getTime();
  //       const arrivalBeforeDepart = arrivalDate.getTime() < reservation.departDate.getTime();
  //       // Return true if the desired reservation doesnt have conflicts
  //       return !arrivalAfterArrival && !arrivalBeforeDepart;
  //     }));
  //   }
  //   if(!arrivalDate && departDate) {
  //     roomFilters.push((room: HotelRoom) => room.reservations.every(reservation => {
  //       const departAfterArrival = departDate.getTime() > reservation.arrivalDate.getTime();
  //       const departBeforeDepart = departDate.getTime() < reservation.departDate.getTime();
  //       // Return true if the desired reservation doesnt have conflicts
  //       return !departAfterArrival && !departBeforeDepart;
  //     }));
  //   }
  //   hotels = hotels.map(hotel => {
  //     hotel.rooms = hotel.rooms.filter(room => {
  //       return roomFilters.every(roomFilter => roomFilter(room));
  //     });
  //     return hotel;
  //     // Filter hotels where at least one room matches all filters
  //     // return hotel.rooms.some(room => {
  //     //   return roomFilters.every(filter => filter(room));
  //     // });
  //   });
  //   console.log(hotels);
  //   return hotels.filter(hotel => hotel.rooms.length);
  // }

  async findHotels(searchRequest: SearchHotelRequest): Promise<Hotel[]> {
    const { arrivalDate, departDate, globalSearch, numberOfGuests } = searchRequest;
    let hotels = this.mockedHotels;
    if(globalSearch) {
      hotels = hotels.filter(hotel => {
        const { name, country, address } = hotel;
        return `${name} ${country} ${address}`.includes(globalSearch);
      });
    }
    return hotels.filter(hotel => {
      const hotelRooms = this.roomService.getAvailableHotelRooms(hotel.id, searchRequest);
      return hotelRooms.length > 0;
    })
    // const { arrivalDate, departDate, globalSearch, numberOfGuests } = searchRequest;
    // let hotels = this.mockedHotels;
    // if(globalSearch) {
    //   hotels = hotels.filter(hotel => {
    //     const { name, country, address } = hotel;
    //     return `${name} ${country} ${address}`.includes(globalSearch);
    //   });
    // }
    // const roomFilters = [
    //   (room: HotelRoom) => room.enabled,
    // ];

    // if(numberOfGuests && numberOfGuests > 1) {
    //   roomFilters.push((room: HotelRoom) => room.capacity >= numberOfGuests);
    // }
    // if(arrivalDate && departDate) {
    //   roomFilters.push((room: HotelRoom) => room.reservations.every(reservation => {
    //     const arrivalBeforeDepart = arrivalDate.getTime() < reservation.departDate.getTime();
    //     const departAfterArrival = departDate.getTime() > reservation.arrivalDate.getTime();
    //     // Return true if the desired reservation doesnt have conflicts
    //     return !arrivalBeforeDepart && !departAfterArrival;
    //   }));
    // }
    // if(arrivalDate && !departDate) {
    //   roomFilters.push((room: HotelRoom) => room.reservations.every(reservation => {
    //     const arrivalAfterArrival = arrivalDate.getTime() > reservation.arrivalDate.getTime();
    //     const arrivalBeforeDepart = arrivalDate.getTime() < reservation.departDate.getTime();
    //     // Return true if the desired reservation doesnt have conflicts
    //     return !arrivalAfterArrival && !arrivalBeforeDepart;
    //   }));
    // }
    // if(!arrivalDate && departDate) {
    //   roomFilters.push((room: HotelRoom) => room.reservations.every(reservation => {
    //     const departAfterArrival = departDate.getTime() > reservation.arrivalDate.getTime();
    //     const departBeforeDepart = departDate.getTime() < reservation.departDate.getTime();
    //     // Return true if the desired reservation doesnt have conflicts
    //     return !departAfterArrival && !departBeforeDepart;
    //   }));
    // }
    // hotels = hotels.filter(hotel => {
    //   // Filter hotels where at least one room matches all filters
    //   return hotel.rooms.some(room => {
    //     return roomFilters.every(filter => filter(room));
    //   });
    // });
    return hotels;
  }

  async createHotel(data: CreateHotelPayload): Promise<boolean> {
    const hotel: Hotel = {
      id: uuid.v4(),
      ...data,
      rooms: [],
      enabled: false,
    };
    const updatedHotels = this.mockedHotels.concat(hotel);
    this.hotels$.next(updatedHotels);
    // Mocked result we assume errors never get triggered while adding a hotel.
    return true;
  }

  async updateHotel(id: string, data: Partial<Omit<Hotel, 'id'>>) {
    const updatedHotels = this.mockedHotels.map(hotel => {
      if(hotel.id === id) {
        hotel = { ...hotel, ...data, id };
      }
      return hotel;
    });
    this.hotels$.next(updatedHotels);
    return true;
  }

  async addHotelRoom(hotelId: string, data: CreateHotelRoomPayload) {
    await this.roomService.createRoom(hotelId, data);
  }

  async deleteHotel(id: string): Promise<boolean> {
    const currentHotelLength = this.mockedHotels.length;
    const hotels = this.mockedHotels.filter(hotel => hotel.id !== id);
    this.roomService.deleteHotelRooms(id);
    this.hotels$.next(hotels);
    return currentHotelLength != hotels.length;
  }

  async refresh() {
    this.hotels$.next([ ...this.mockedHotels ]);
  }
}
