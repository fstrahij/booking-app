import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";
import { Subject, take, takeUntil } from 'rxjs';

import {PlacesService} from "../../../../services/places/places.service";
import { PlaceLocation } from 'src/app/models/location.model';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
  standalone: false
})
export class NewOfferPage implements OnInit, OnDestroy  {
  destroyed$ = new Subject();
  form: FormGroup;
  isLoading = false;
  message: string = 'Loading...';
  isChangePage  = false;
  pickedLocation: PlaceLocation;

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.form = this.placesService.getForm();

    this.placesService.addPickedLocation(null)
        .pipe(take(1))
        .subscribe(()=> {
          this.placesService.location
            .pipe(takeUntil(this.destroyed$))
            .subscribe(location => this.pickedLocation = location);
        });
  }

  onImagePick(imageData: string){

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
        this.pickedLocation.address,
        this.pickedLocation.lat,
        this.pickedLocation.lng,
    ).subscribe(places => {
      this.isLoading = false;
      this.isChangePage = true;
    });
  }

  ngOnDestroy(){
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }
}
