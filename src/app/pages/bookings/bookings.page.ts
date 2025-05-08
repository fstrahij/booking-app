import { Component, OnInit } from '@angular/core';

import {IonItemSliding} from "@ionic/angular";

import {BookingService} from "../../services/booking/booking.service";
import {Booking} from "../../models/booking.model";

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
  standalone: false
})
export class BookingsPage implements OnInit {
  loadedBookings: Booking[];

  constructor(private bookingService: BookingService) { }

  ngOnInit() {
    this.loadedBookings = this.bookingService.bookings;
  }

  onCancel(id:string, slidingItem: IonItemSliding){
    slidingItem.close();
  }

}
