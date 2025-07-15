import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, delay, forkJoin, map, of, switchMap, take, tap, throwError} from "rxjs";

import {AuthService} from "../auth/auth.service";
import {Place, PlaceData} from "../../models/place.model";
import {environment} from "../../../environments/environment";
import { PlaceLocation, PlaceLocationResponse } from 'src/app/models/location.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);
  private _location = new BehaviorSubject<PlaceLocation>(null);

  get places(){
      return this._places.asObservable();
  }

  get location(){
    return this._location.asObservable();
  }

  constructor(private authService: AuthService,
              private http: HttpClient,
  ) { }

  getPlace(id: string){
      return !this._places || this._places.value.length <= 0 ?
          this.fetchSinglePLace(id) :
          this._places
          .pipe(
              take(1),
              map(places => places.find( p => p.id === id ))
          );
  }

  getPlaceIndex(id: string){
      return this._places
          .pipe(
              take(1),
              map(places => places.findIndex( p => p.id === id ))
          );
  }

  addPlace(title: string, description: string, guestNumber: number, dateFrom: Date, dateTo: Date, address: string, lat: number, lng: number){
      const newPlace = this.createPlace(title, description, guestNumber, dateFrom, dateTo, address, lat, lng);

      return this.post(newPlace)
          .pipe(
              take(1),
              delay(1000),
              switchMap(newPlace => {
                  return this._places
                      .pipe(
                          take(1),
                          delay(1000),
                          tap(places => this._places.next(places.concat(newPlace)))
                      )
              })
          );
  }

  addPickedLocation(newLocation: PlaceLocation){
        return this._location
            .pipe(
                take(1),
                tap(() => this._location.next(newLocation))
            );
  }

  updatePlace(id: string, title: string, description: string, guestNumber: number, dateFrom: Date, dateTo: Date){
      const newPlace = this.createPlace(title, description, guestNumber, dateFrom, dateTo, null, null, null);

      return this.update(newPlace, id)
          .pipe(
              switchMap(response =>{
                  console.log('update',response);

                  return !this._places || this._places.value.length <= 0 ?
                      of(null) :
                      forkJoin([
                          this.getPlaceIndex(id),
                          this._places.pipe(take(1))
                      ])
                      .pipe(
                          delay(1000),
                          map(data => {
                              const index = data[0];
                              const places = data[1];
                              const newPlaces = [
                                  ...places.slice(0, index),
                                  newPlace,
                                  ...places.slice(index + 1),
                              ];

                              this._places.next(newPlaces);
                          })
                      );
              })
          );
  }

    fetchAll(){
        return this.http
            .get<{ [key: string]: PlaceData }>(environment.api.offers)
            .pipe(
                delay(1000),
                map(response => {
                    const places: Place[] = [];
                    for(const key in response){
                        if(response.hasOwnProperty(key)){
                            const newPlace = this.createPlace(
                                response[key].title,
                                response[key].description,
                                +response[key].price,
                                new Date( response[key].dateFrom ),
                                new Date( response[key].dateTo ),
                                response[key].address,
                                +response[key].lat,
                                +response[key].lng,
                                key,
                                response[key].imageUrl,
                                response[key].userId
                            );
                            places.push(newPlace);
                        }
                    }
                    return places;
                }),
                tap(places => this._places.next(places))
            )
    }

  fetchSinglePLace(id: string){
      return this.http
          .get< PlaceData >(`${environment.api.singleOffer}${id}.json`)
          .pipe(
              map(response => {
                  for(const key in response){
                      if(response.hasOwnProperty(key)){
                          return this.createPlace(
                              response.title,
                              response.description,
                              +response.price,
                              new Date( response.dateFrom ),
                              new Date( response.dateTo ),
                              null,
                              null,
                              null,
                              id,
                              response.imageUrl,
                              response.userId
                          );
                      }
                  }
                  throw new Error('Place not found');
              })
          )
  }

  fetchSearchLocation(address: string){
      const cleanAddress = address.replace(/\s/g, "+").toLowerCase();

      return this.http.get<PlaceLocationResponse[]>(`${environment.api.geocode}/search?q=${cleanAddress}&format=jsonv2`)
            .pipe(
                map(response => {
                    for(const key in response){
                        if(response.hasOwnProperty(key) && response.length > 0){
                            return {
                                address: response[0].display_name,
                                lat: +response[0].lat,
                                lng: +response[0].lon
                            };
                        }
                    }
                    throw new Error('Search location not found');
                })
            );
  }

  getForm(){
      return new FormGroup({
          title: new FormControl(null, Validators.required),
          description: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
          price: new FormControl(null, [Validators.required, Validators.min(1)]),
          dateFrom: new FormControl(null, Validators.required),
          dateTo: new FormControl(null, Validators.required),
      });
  }

  patchFormValues(form: FormGroup, place: Place){
      form.patchValue({
          title: place?.title,
          description: place?.description,
          price: place?.price,
          dateFrom: place?.dateFrom.toISOString(),
          dateTo: place?.dateTo.toISOString(),
      });
  }

  createPlace(
      title: string,
      description: string,
      guestNumber: number,
      dateFrom: Date,
      dateTo: Date,
      address: string,
      lat: number,
      lng: number,
      id: string = null,
      imageUrl: string = 'https://www.roadaffair.com/wp-content/uploads/2020/03/aerial-view-zagreb-croatia-shutterstock_1199253325.jpg',
      userId?: string,
  ){
      return new Place(
          id,
          title,
          description,
          imageUrl,
          +guestNumber,
          dateFrom,
          dateTo,
          userId || this.authService.userId,
          address,
          lat.toString(),
          lng.toString()
      );
  }
    private post(newPlace: Place){
        return this.http
            .post<{name}>(environment.api.offers, newPlace)
            .pipe(
                map(response => {
                    console.log('post', response);
                    newPlace.id = response.name;
                    return newPlace;
                })
            )
    }
  private update(place: Place, id: string){
      return this.http.put(`${environment.api.singleOffer}${id}.json`, place);
  }
  private delete(id: string){}
}
