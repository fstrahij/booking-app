import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";

import {ModalController} from "@ionic/angular";

import {Place} from "../../models/place.model";

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
  standalone: false
})
export class CreateBookingComponent  implements OnInit {
   @Input() place: Place;
   @Input() mode: 'select' | 'random';
   @ViewChild('f') form: NgForm;

   startDate: string;
   endDate: string;
   endDateMin: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.switchMode();
  }

  onCancel(){
    this.modalCtrl.dismiss(null, 'cancel-booking');
  }
  onBook(){
    if(this.form.invalid || !this.isDatesValid()) return;

    this.modalCtrl.dismiss(
        {
          bookingData: {
            firstName: this.form.value['first-name'],
            lastName: this.form.value['last-name'],
            guestNumber: +this.form.value['guest-number'],
            dateFrom: new Date(this.form.value['date-from']),
            dateTo: new Date(this.form.value['date-to']),
          }
        }, 'confirm');
  }

  setEndDate(){
    this.endDateMin = new Date(new Date(this.startDate).getTime() + 36 * 60 * 60 * 1000).toISOString();

    if(new Date(this.endDate).getDate() > new Date(this.startDate).getDate()) return;

    this.endDate = this.endDateMin;
  }

  isDatesValid(){
    const fromDate = new Date(this.form?.value['date-from']).getDate();
    const toDate = new Date(this.form?.value['date-to']).getDate();

    return fromDate < toDate;
  }

  private switchMode(){
    const availableFrom = new Date(this.place.dateFrom);
    const availableTo = new Date(this.place.dateTo);

    if(this.mode === 'random'){
      this.startDate = new Date( availableFrom.getTime() + Math.random() * (availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - availableFrom.getTime()) ).toISOString();
      this.endDate = new Date( new Date(this.startDate).getTime() + Math.random() * (new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime()) ).toISOString();
    }else{
      this.startDate = new Date().toISOString();
      this.setEndDate();
    }
  }
}
