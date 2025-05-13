import {Component, OnDestroy, OnInit} from '@angular/core';

import {IonItemSliding, LoadingController} from "@ionic/angular";

import {BookingService} from "../../services/booking/booking.service";
import {Booking} from "../../models/booking.model";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
  standalone: false
})
export class BookingsPage implements OnInit, OnDestroy {
  destroyed$ = new Subject();
  loadedBookings: Booking[];
  isLoading = false;

  constructor(private bookingService: BookingService,
              private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.bookingService
        .bookings
        .pipe(takeUntil(this.destroyed$))
        .subscribe(bookings =>{
          this.loadedBookings = bookings;
          this.isLoading = false;
        });
  }

  onCancel(id:string, slidingItem: IonItemSliding){
    slidingItem.close();

    this.loadingCtrl.create({
      keyboardClose: true,
      message: 'Canceling booking...'
    })
    .then(loading=>{
      loading.present();

      this.bookingService
          .cancelBooking(id)
          .subscribe(()=> loading.dismiss());
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }
}
