import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, debounceTime, firstValueFrom, takeUntil } from 'rxjs';
import { Assets } from 'src/app/app.assets';
import { HotelService } from 'src/app/shared/services/hotel/hotel.service';
import { Hotel } from 'src/app/shared/services/hotel/models/hotel';
import { SearchHotelRequest } from 'src/app/shared/services/hotel/models/search-hotel-request';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnDestroy {
  onDestroy$: Subject<void> = new Subject();
  arrivalDate?: Date;
  departDate?: Date;
  searchValue: string = "";
  availableHotels: Hotel[] = [];
  numberOfGuests: number = 1;
  searchDebouncer: BehaviorSubject<SearchHotelRequest> = new BehaviorSubject({});
  imageUrl = Assets.noImageFoundSvg;

  constructor(
    private readonly router: Router,
    private readonly hotelService: HotelService,
  ) {
    this.searchDebouncer
      .pipe(
        takeUntil(this.onDestroy$),
        debounceTime(500),
      )
      .subscribe(async (searchRequest) => {
        const matchedHotels = await this.hotelService.findHotels(searchRequest);
        this.availableHotels = matchedHotels;
      });
    this.searchDebouncer.next({});
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  handleSearchChange(changes: Partial<SearchHotelRequest>) {
    const lastSearch = this.searchDebouncer.value;
    this.searchDebouncer.next({ ...lastSearch, ...changes });
  }

  viewHotel(hotel: Hotel) {
    this.router.navigate([`/home/reservations/hotel/${hotel.id}`], { queryParams: this.searchDebouncer.value });
  }
}
