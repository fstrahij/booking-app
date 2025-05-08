import { Injectable } from '@angular/core';
import {BehaviorSubject, delay, take, tap} from "rxjs";

import {Booking} from "../../models/booking.model";

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  get bookings(){
    return this._bookings.asObservable();
  }

  constructor() { }

  addBooking(
      placeId: string,
      placeTitle: string,
      placeImage: string,
      firstName: string,
      lastName: string,
      guestNumber: number,
      guestId: string,
      dateFrom: Date,
      dateTo: Date,
  ){
    const newBooking = new Booking(
        Math.random().toString(),
        placeId,
        placeTitle,
        placeImage,
        firstName,
        lastName,
        guestNumber,
        guestId,
        dateFrom,
        dateTo
    );

    return this.bookings
                .pipe(
                    take(1),
                    delay(1000),
                    tap(bookings => this._bookings.next(bookings.concat(newBooking)))
                );
  }

  cancelBooking(id: string){
    return this._bookings
        .pipe(
            take(1),
            delay(1000),
            tap(bookings => this._bookings.next(bookings.filter(b => b.id !== id)))
        );
  }
}
