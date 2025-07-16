import { Component, Input, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

import {MapModalComponent} from "../map-modal/map-modal.component";
import { PlacesService } from 'src/app/services/places/places.service';
import { PlaceLocation } from 'src/app/models/location.model';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
  standalone: false
})
export class LocationPickerComponent  implements OnInit {
  @Input() location?: PlaceLocation;  

  isLoading = false;

  constructor(private modalCtrl: ModalController,
              private placesService: PlacesService
  ) { }

  ngOnInit() {}

  onSelectLocation(){
    this.modalCtrl.create({
      component: MapModalComponent,
      componentProps: {
        location: this.location
      }
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
