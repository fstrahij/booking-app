import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {Place} from "../../models/place.model";

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
  standalone: false
})
export class CreateBookingComponent  implements OnInit {
   @Input() place: Place

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  onCancel(){
    this.modalCtrl.dismiss(null, 'cancel-booking');
  }
  onBook(){
    this.modalCtrl.dismiss({message: 'booking success'}, 'success');
  }
}
