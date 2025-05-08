import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";

import {SegmentChangeEventDetail} from "@ionic/angular";

import {PlacesService} from "../../../services/places/places.service";
import {AuthService} from "../../../services/auth/auth.service";
import {Place} from "../../../models/place.model";

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
  standalone: false
})
export class DiscoverPage implements OnInit, OnDestroy {
  destroyed$ = new Subject();
  allPlaces: Place[] = [];
  showedPlaces: Place[] = [];
  featuredPlace: Place;
  selectedView: string = 'all';

  constructor(private placeService: PlacesService,
              private authService: AuthService
  ) { }

  ngOnInit() {
    this.placeService
        .places
        .pipe(takeUntil(this.destroyed$))
        .subscribe(places => {
          if (places && places.length > 0) {
            this.allPlaces = this.showedPlaces = places;
            this.featuredPlace = places[0];
          }
        });
  }

  onFilterChange(event: CustomEvent<SegmentChangeEventDetail>){
    this.selectedView = event.detail.value.toString();

    if(event.detail.value === 'all'){
      this.featuredPlace = {...this.allPlaces[0]};
      this.showedPlaces = [...this.allPlaces];
    }
    else if(event.detail.value === 'bookable'){
      this.showedPlaces = [...this.allPlaces.filter(place => place.userId !== this.authService.userId)];
      if(this.showedPlaces?.length > 0){
        this.featuredPlace = {...this.showedPlaces[0]};
      }
    }
    console.log(event.detail);
  }

  ngOnDestroy(){
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }
}
