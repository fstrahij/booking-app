import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {NavController} from "@ionic/angular";

import {PlacesService} from "../../../../services/places/places.service";
import {Place} from "../../../../models/place.model";

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
  standalone: false
})
export class OfferBookingsPage implements OnInit {
  place: Place;
  placeId = '';
  isLoading = false;

  constructor(private route: ActivatedRoute,
              private navCtrl: NavController,
              private placesService: PlacesService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('places/tabs/offers');
        return;
      }

      this.placeId = paramMap.get('placeId');

      this.placesService
          .getPlace(paramMap.get('placeId'))
          .subscribe(place => {
            this.place = place;

            this.isLoading = false;
          });
    });
  }

}
