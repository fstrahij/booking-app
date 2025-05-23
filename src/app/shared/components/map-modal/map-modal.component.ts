import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {ModalController} from "@ionic/angular";

import {GeolocateControl, Map, Marker, NavigationControl} from "maplibre-gl";
import {environment} from "../../../../environments/environment";


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

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const initialState = { lng: 15.644, lat: 46.200, zoom: 14, controlPos: 'top-right' };

    this.map = this.getMap(initialState);

    this.setMapControls(initialState.controlPos);

    this.setMarker(initialState);

    this.map.on("click", (e) => this.onMapClick(e));
  }

  onCancel(){
    this.modalCtrl.dismiss();
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
