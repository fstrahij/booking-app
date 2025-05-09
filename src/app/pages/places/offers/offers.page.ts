import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Subject, takeUntil} from "rxjs";

import {IonItemSliding, LoadingController} from "@ionic/angular";

import {PlacesService} from "../../../services/places/places.service";
import {Place} from "../../../models/place.model";

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
  standalone: false
})
export class OffersPage implements OnInit, OnDestroy {
  destroyed$ = new Subject();
  offers: Place[] = [];

  constructor(private placesService: PlacesService,
              private router: Router,
              private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
    this.showLoader();
  }

  showLoader(){
    this.loadingCtrl.create({
      keyboardClose: true,
      message: 'Loading...',
    })
    .then(loading =>{
      loading.present();

      this.placesService
          .places
          .pipe(takeUntil(this.destroyed$))
          .subscribe(places => {
            this.offers = places;
            loading.dismiss();
          });
    });
  }

  onEdit(offerId: string, swipableItem: IonItemSliding){
    swipableItem.close();

    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }

  ngOnDestroy(){
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }

}
