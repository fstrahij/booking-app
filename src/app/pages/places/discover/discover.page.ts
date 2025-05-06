import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";

import {SegmentChangeEventDetail} from "@ionic/angular";

import {PlacesService} from "../../../services/places/places.service";
import {Place} from "../../../models/place.model";

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
  standalone: false
})
export class DiscoverPage implements OnInit, OnDestroy {
  destroyed$ = new Subject();
  loadedPlaces: Place[] = [];

  constructor(private placeService: PlacesService) { }

  ngOnInit() {
    this.placeService
        .places
        .pipe(takeUntil(this.destroyed$))
        .subscribe(places => this.loadedPlaces = places);
  }

  onFilterChange(event: CustomEvent<SegmentChangeEventDetail>){
    console.log(event.detail);
  }

  ngOnDestroy(){
    this.destroyed$.next(null);
    this.destroyed$.complete();
  }
}
