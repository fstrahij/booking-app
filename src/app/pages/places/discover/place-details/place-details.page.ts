import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {
    ActionSheetController,
    AlertController,
    LoadingController,
    ModalController,
    NavController
} from "@ionic/angular";

import {PlacesService} from "../../../../services/places/places.service";
import {AuthService} from "../../../../services/auth/auth.service";
import {BookingService} from "../../../../services/booking/booking.service";
import {CreateBookingComponent} from "../../../../components/create-booking/create-booking.component";
import {Place} from "../../../../models/place.model";
import {catchError, throwError} from "rxjs";

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.page.html',
  styleUrls: ['./place-details.page.scss'],
  standalone: false
})
export class PlaceDetailsPage implements OnInit {
  place: Place;
  isBookable = false;
  isLoading = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private navCtrl: NavController,
              private placesService: PlacesService,
              private bookingsService: BookingService,
              private authService: AuthService,
              private modalCtrl: ModalController,
              private actionSheetCtrl: ActionSheetController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap =>{
      if(!paramMap.has('placeId')){
        this.navCtrl.navigateBack('places/tabs/discover');
        return;
      }

      this.placesService
          .getPlace(paramMap.get('placeId'))
          .pipe(
              catchError(error => {
                  console.log(error);

                  this.alertCtrl.create({
                      header:'An error occured!',
                      message: 'Place could not be fetched. Please try again later',
                      buttons: [{
                          text: 'Okay',
                          handler: () => this.router.navigate(['/places/tabs/discover']),
                      }]
                  }).then(alert => alert.present());
                  return throwError(error);
              })
          )
          .subscribe(place => {
              this.place = place;
              this.isBookable = this.place.userId !== this.authService.userId;
              this.isLoading = false;
          });
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
          componentProps: { place: this.place, mode: action }
        })
        .then(modal => {
          modal.present();
          return modal.onDidDismiss()
        })
        .then(result => {
          if(result.role === 'confirm'){
              const data = result.data.bookingData;
              this.addBooking(data);
          }
        });
  }

  private addBooking(data){
      this.loadingCtrl.create({
          keyboardClose: true,
          message: 'Create Booking...',
      })
      .then(loading =>{
          loading.present();

          this.bookingsService.addBooking(
              this.place.id,
              this.place.title,
              this.place.imageUrl,
              data.firstName,
              data.lastName,
              +data.guestNumber,
              this.authService.userId,
              data.dateFrom,
              data.dateTo,
          ).subscribe(book => {
              loading.dismiss();
          });
      });
  }
}
