import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, delay, map, switchMap, take, tap} from "rxjs";

import {AuthService} from "../auth/auth.service";
import {Booking, BookingData} from "../../models/booking.model";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  get bookings(){
    return this._bookings.asObservable();
  }

  constructor(private http: HttpClient,
              private authService: AuthService,
  ) { }

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

    return this.post(newBooking)
        .pipe(
            take(1),
            switchMap(booking =>{
              return this.bookings
                  .pipe(
                      take(1),
                      delay(1000),
                      tap(bookings => this._bookings.next(bookings.concat(booking)))
                  );
            })
        )
  }

  fetchUserBookings(){
      return this.http
          .get<{[key: string]: BookingData}>(`${environment.api.bookingsByUser}"${this.authService.userId}"`)
          .pipe(
              delay(1000),
              map(response=>{
                  const bookings: Booking[] = [];
                  for (const key in response){
                        if(response.hasOwnProperty(key)){
                            const newBooking = new Booking(
                                key,
                                response[key].placeId,
                                response[key].placeTitle,
                                response[key].placeImage,
                                response[key].firstName,
                                response[key].lastName,
                                +response[key].guestNumber,
                                response[key].guestId,
                                new Date(response[key].dateFrom),
                                new Date(response[key].dateFrom)
                            );
                            bookings.push(newBooking);
                        }
                  }
                  return bookings;
              }),
              tap(bookings=>this._bookings.next(bookings))
          );
  }

  cancelBooking(id: string){
    return this.delete(id)
        .pipe(
            switchMap(()=>{
                return this._bookings
                    .pipe(
                        take(1),
                        delay(1000),
                        tap(bookings => this._bookings.next(bookings.filter(b => b.id !== id)))
                    );
            })
        )
  }

  private post(newBooking: Booking){
    return this.http
        .post<{name}>(`${environment.api.bookings}`, {...newBooking, id: null})
        .pipe(
            map(response => {
              newBooking.id = response.name;
              return newBooking;
            })
        );
  }

  private update(){

  }

  private delete(id:string){
      return this.http.delete(`${environment.api.singleBooking}${id}.json`);
  }
}
