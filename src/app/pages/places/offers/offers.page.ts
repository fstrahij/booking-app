import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Subject, takeUntil} from "rxjs";

import {IonItemSliding} from "@ionic/angular";

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
  isLoading = false;

  constructor(private placesService: PlacesService,
              private router: Router,
  ) { }

  ngOnInit() {
    this.placesService
        .places
        .pipe(takeUntil(this.destroyed$))
        .subscribe(places => {
          this.offers = places;
        });
  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.placesService.fetchAll()
        .subscribe(()=> this.isLoading = false);
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
