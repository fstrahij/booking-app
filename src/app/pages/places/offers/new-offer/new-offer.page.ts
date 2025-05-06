import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";

import {LoadingController} from "@ionic/angular";

import {PlacesService} from "../../../../services/places/places.service";

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
  standalone: false
})
export class NewOfferPage implements OnInit {
  form: FormGroup;

  constructor(private placesService: PlacesService,
              private router: Router,
              private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      price: new FormControl(null, [Validators.required, Validators.min(1)]),
      dateFrom: new FormControl(null, Validators.required),
      dateTo: new FormControl(null, Validators.required),
    })
  }

  onCreateOffer(){
    if(this.form.invalid) return;

    this.loadingCtrl
        .create({ message:'Creating new offer...',})
        .then(loading => {
          loading.present();

          this.placesService.addPlace(
              this.form.value.title,
              this.form.value.description,
              this.form.value.price,
              this.form.value.dateFrom,
              this.form.value.dateTo,
          ).subscribe(places => {
            loading.dismiss();
            this.form.reset();
            this.router.navigate(['/', 'places', 'tabs', 'offers']);
          });
        });
  }
}
