import { Component, OnInit } from '@angular/core';

import {IonItemSliding} from "@ionic/angular";

import {PlacesService} from "../../../services/places/places.service";
import {Place} from "../../../models/place.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
  standalone: false
})
export class OffersPage implements OnInit {
  offers: Place[] = [];

  constructor(private placesService: PlacesService, private router: Router) { }

  ngOnInit() {
    this.offers = this.placesService.places;
  }

  onEdit(offerId: string, swipableItem: IonItemSliding){
    swipableItem.close();

    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }

}
