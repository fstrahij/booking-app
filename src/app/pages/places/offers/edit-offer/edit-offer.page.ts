import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormGroup} from "@angular/forms";
import {delay} from "rxjs";

import {NavController} from "@ionic/angular";

import {PlacesService} from "../../../../services/places/places.service";
import {Place} from "../../../../models/place.model";

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
  standalone: false
})
export class EditOfferPage implements OnInit {
  place: Place;
  form: FormGroup;
  isLoading = false;
  isChangePage = false;
  message: string = 'Loading...';
  placeId = '';

  constructor(private route: ActivatedRoute,
              private navCtrl: NavController,
              private placesService: PlacesService
  ) { }

  ngOnInit() {
    this.form = this.placesService.getForm();
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap =>{
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('places/tabs/offers');
        return;
      }
      this.placeId = paramMap.get('placeId');
      this.placesService
          .getPlace(paramMap.get('placeId'))
          .pipe(delay(1000))
          .subscribe(place => {
            this.place = place;

            this.placesService.patchFormValues(this.form, this.place);

            this.isLoading = false;
          });
    });
  }

  onEditOffer(){
    if(this.form.invalid){ return }

    this.message = 'Updating offer...';
    this.isLoading = true;

    this.placesService
        .updatePlace(
            this.place.id,
            this.form.value.title,
            this.form.value.description,
            +this.form.value.price,
            new Date(this.form.value.dateFrom),
            new Date(this.form.value.dateTo)  ,
        )
        .subscribe(place => {
          console.log('update finished');
          this.isLoading = false;
          this.isChangePage = true;
        })
  }

}
