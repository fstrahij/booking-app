import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {LoadingController, ModalController} from "@ionic/angular";
import { catchError } from 'rxjs';

import {GeolocateControl, Map, Marker, NavigationControl} from "maplibre-gl";
import {PlacesService} from "../../../services/places/places.service";
import {environment} from "../../../../environments/environment";
import { PlaceLocation } from 'src/app/models/location.model';


@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
  standalone: false,
})
export class MapModalComponent  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  map: Map;
  marker: Marker = new Marker({
    color: "#FF0000",
    draggable: true,
  });
  location: PlaceLocation;

  constructor(private modalCtrl: ModalController, 
              private loadingCtrl: LoadingController,
              private placesService: PlacesService
            ) { }

  ngOnInit() {
    console.log('selected location', this.location);
  }

  ngAfterViewInit() {
    const initialState = { 
      lng: this.location?.lng || 15.644, 
      lat: this.location?.lat || 46.200, 
      zoom: 14, 
      controlPos: 'top-right' 
    };

    this.map = this.getMap(initialState);

    this.setMapControls(initialState.controlPos);

    this.setMarker(initialState);

    this.map.on("click", (e) => this.onMapClick(e));
  }

  onCancel(){
    this.modalCtrl.dismiss({
          location: {
            address: this.location?.address,
            lat: this.location?.lat,
            lng: this.location?.lng
          }
        });
  }

  onSearch(address: string) {
    if(address.trim().length <= 0) return;

    this.loadingCtrl
          .create({
            keyboardClose: true,
            message: 'Loading...'
          })
          .then(loading =>  {
            loading.present();

            this.placesService.fetchSearchLocation(address)
                .pipe( catchError( () => this.loadingCtrl?.dismiss() ) )  
                .subscribe((response: PlaceLocation)=>{
                  if(!response || !response?.address || !response?.lat?.toString() || !response?.lng?.toString()) return;

                  this.setMarker({lng: response.lng, lat: response.lat});
                  this.map.setCenter([response.lng, response.lat]);
                  this.location = {...response};
                  this.loadingCtrl?.dismiss();
                })
          });
  }

  private getMap(initialState){
    return new Map({
      container: this.mapContainer.nativeElement,
      style: `${environment.api.maplibre}`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });
  }

  private setMapControls(controlPos?){
    this.map.addControl(new NavigationControl({
      visualizePitch: false,
      visualizeRoll: false,
      showZoom: true,
      showCompass: false
    }), controlPos);

    this.map.addControl(new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));
  }

  private setMarker(initialState){
    this.marker
        .setLngLat([initialState.lng,initialState.lat])
        .addTo(this.map);
  }

  private onMapClick(e: any){
    console.log(e);
    const location = {lng: e.lngLat.lng, lat: e.lngLat.lat};
    this.marker.setLngLat([location.lng, location.lat]);

    this.modalCtrl.dismiss({data: location});
  }

  ngOnDestroy() {
    this.map?.remove();
  }
}
