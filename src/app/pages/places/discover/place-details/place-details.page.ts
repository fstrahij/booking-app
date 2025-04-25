import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {ActionSheetController, ModalController, NavController} from "@ionic/angular";

import {PlacesService} from "../../../../services/places/places.service";
import {Place} from "../../../../models/place.model";
import {CreateBookingComponent} from "../../../../components/create-booking/create-booking.component";

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.page.html',
  styleUrls: ['./place-details.page.scss'],
  standalone: false
})
export class PlaceDetailsPage implements OnInit {
  place: Place;

  constructor(private route: ActivatedRoute,
              private navCtrl: NavController,
              private placesService: PlacesService,
              private modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap =>{
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('places/tabs/discover');
        return;
      }
      this.place = this.placesService.getPlace(paramMap.get('placeId'));
    });
  }

  onBookPlace(){
    this.actionSheetCtrl
        .create({
              header: 'Choose an Action',
              buttons: [
                  {
                      text: 'Select Date',
                      handler: () => {
                          this.showModal('select');
                      }
                  },
                  {
                      text: 'Random Date',
                      handler: () => {
                          this.showModal('random');
                      }
                  },
                  {
                      text: 'Cancel',
                      role: 'cancel',
                  },
              ],
            })
        .then(ctrl =>{
            ctrl.present();
        })
  }
  private showModal(action: 'select' | 'random'){
    console.log(action);

    this.modalCtrl
        .create({
          component: CreateBookingComponent,
          componentProps: { place: this.place }
        })
        .then(modal => {
          modal.present();

          return modal.onDidDismiss()
        })
        .then(result => {
          console.log(result.data, result.role);
        });
  }
}
