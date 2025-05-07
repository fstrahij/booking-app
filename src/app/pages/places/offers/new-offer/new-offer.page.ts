import { Component, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";

import {PlacesService} from "../../../../services/places/places.service";

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
  standalone: false
})
export class NewOfferPage implements OnInit {
  form: FormGroup;
  isLoading = false;
  message: string = 'Loading...';
  isChangePage  = false;

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.form = this.placesService.getForm();
  }

  onCreateOffer(){
    if(this.form.invalid) return;

    this.message = 'Creating new offer...';
    this.isLoading = true;

    this.placesService.addPlace(
        this.form.value.title,
        this.form.value.description,
        this.form.value.price,
        new Date (this.form.value.dateFrom),
        new Date (this.form.value.dateTo),
    ).subscribe(places => {
      this.isLoading = false;
      this.isChangePage = true;
    });
  }
}
