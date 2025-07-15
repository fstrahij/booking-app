import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

import {MapModalComponent} from "../map-modal/map-modal.component";
import {environment} from "../../../../environments/environment";
import {MapResponse} from "../../../models/map.model";
import {PlaceLocation} from "../../../models/location.model";
import { PlacesService } from 'src/app/services/places/places.service';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
  standalone: false
})
export class LocationPickerComponent  implements OnInit {
  isLoading = false;

  constructor(private modalCtrl: ModalController,
              private http: HttpClient,
              private placesService: PlacesService
  ) { }

  ngOnInit() {}

  onSelectLocation(){
    this.modalCtrl.create({
      component: MapModalComponent,
    }).then(
        modalEl => {
          modalEl.onDidDismiss()
              .then(data => { 
                  this.isLoading = true;
                  if(!data?.data?.location) {
                      this.isLoading = false;
                      return;
                  }

                  this.placesService.addPickedLocation(data.data.location)
                    .subscribe(() => this.isLoading = false);
              });

          modalEl.present();
    });
  }
}
