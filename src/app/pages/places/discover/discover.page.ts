import { Component, OnInit } from '@angular/core';
import {PlacesService} from "../../../services/places/places.service";
import {Place} from "../../../models/place.model";
import {SegmentChangeEventDetail} from "@ionic/angular";

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
  standalone: false
})
export class DiscoverPage implements OnInit {
  loadedPlaces: Place[] = [];

  constructor(private placeService: PlacesService) { }

  ngOnInit() {
    this.loadedPlaces = this.placeService.places;
  }

  onFilterChange(event: CustomEvent<SegmentChangeEventDetail>){
    console.log(event.detail);
  }
}
