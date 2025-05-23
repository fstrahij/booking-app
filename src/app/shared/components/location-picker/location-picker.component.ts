import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

import {MapModalComponent} from "../map-modal/map-modal.component";
import {environment} from "../../../../environments/environment";
import {MapResponse} from "../../../models/map.model";
import {PlaceLocation} from "../../../models/location.model";

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
  standalone: false
})
export class LocationPickerComponent  implements OnInit {
  isLoading = false;

  constructor(private modalCtrl: ModalController,
              private http: HttpClient
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
                  if(!data?.data?.data) {
                      this.isLoading = false;
                      return;
                  }

                  const pickedLocation: PlaceLocation = {
                      lat: data.data.data.lat,
                      lng: data.data.data.lng,
                      address: null,
                      imageUrl: null
                  }

                  this.getAddress(data.data.data.lat, data.data.data.lng)
                      .pipe(
                          map(data=> {
                              pickedLocation.address = data.address;
                              pickedLocation.imageUrl = data.extratags?.image;
                              console.log(pickedLocation);
                              this.isLoading = false
                          })
                      ).subscribe()
              });

          modalEl.present()
    });
  }

  private getAddress(lat: number, lng: number){
      return this.http.get<MapResponse>(`${environment.api.geocode}/reverse?format=jsonv2&extratags=1&lat=${lat}&lon=${lng}`)
          .pipe(
              map(response => {
                  console.log(response);
                  const map: MapResponse = {
                      address: response.address,
                      osm_id: response.osm_id,
                      osm_type: response.osm_type,
                      extratags: response.extratags
                  };
                  return map;
              }),
          )
  }
}
