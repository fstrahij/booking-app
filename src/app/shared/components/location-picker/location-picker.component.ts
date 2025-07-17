import { Component, input, Input, OnInit } from '@angular/core';
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
  address;

  constructor(private modalCtrl: ModalController,
              private placesService: PlacesService
  ) { }

  ngOnInit() {
    if(this.location?.address){
      this.address = this.location?.address;
    }
  }

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
                  if(!data?.data?.location?.address) {
                      this.isLoading = false;
                      return;
                  }

                  this.address = data.data.location.address;

                  this.placesService.addPickedLocation(data.data.location)
                    .subscribe(() => this.isLoading = false);
              });

          modalEl.present();
    });
  }

  getBtnText(){
    return this.location?.address ? 'Change Location' : 'Select Location';
  }
}
