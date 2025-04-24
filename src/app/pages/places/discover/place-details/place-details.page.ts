import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {ModalController, NavController} from "@ionic/angular";

import {PlacesService} from "../../../../services/places/places.service";
import {Place} from "../../../../models/place.model";
import {CreateBookingComponent} from "../../../../components/create-booking/create-booking.component";

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.page.html',
  styleUrls: ['./place-details.page.scss'],
  standalone: false
})
export class PlaceDetailsPage implements OnInit {
  place: Place;

  constructor(private route: ActivatedRoute,
              private navCtrl: NavController,
              private placesService: PlacesService,
              private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap =>{
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('places/tabs/discover');
        return;
      }
      this.place = this.placesService.getPlace(paramMap.get('placeId'));
    });
  }

  onBookPlace(){
    this.modalCtrl
        .create({
          component: CreateBookingComponent,
          componentProps: { place: this.place }
        })
        .then(modal => {
          modal.present();

          return modal.onDidDismiss()
        })
        .then(result => {
          console.log(result.data, result.role);
        });
  }

}
