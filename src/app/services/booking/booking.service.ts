import { Injectable } from '@angular/core';
import {Booking} from "../../models/booking.model";

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private _bookings: Booking[] = [
      new Booking('b1', 'p1', 'Manhatann Mansion', 2, 'abc')
  ];

  get bookings(){
    return [...this._bookings];
  }

  constructor() { }
}
