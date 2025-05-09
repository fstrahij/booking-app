import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, delay, forkJoin, map, Observable, switchMap, take, tap} from "rxjs";

import {Place} from "../../models/place.model";
import {AuthService} from "../auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {create} from "ionicons/icons";

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  get places(){
      return this.fetchAll()
          .pipe(
              take(1),
              delay(1000),
              switchMap(places => {
                  console.log(places);
                  this._places.next(places);
                  return this._places.asObservable();
              })
          );
  }

  constructor(private authService: AuthService,
              private http: HttpClient,
  ) { }

  getPlace(id: string){
      return this._places
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

  addPlace(title: string, description: string, guestNumber: number, dateFrom: Date, dateTo: Date){
      const newPlace = this.createPlace(title, description, guestNumber, dateFrom, dateTo);

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

  updatePlace(id: string, title: string, description: string, guestNumber: number, dateFrom: Date, dateTo: Date){
      const newPlace = this.createPlace(title, description, guestNumber, dateFrom, dateTo, id);

      return this.update(newPlace)
          .pipe(
              switchMap(response =>{
                  console.log('update',response);

                  return forkJoin([
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
                      )
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

  createPlace(title: string, description: string, guestNumber: number, dateFrom: Date, dateTo: Date, id: string = null, imageUrl: string = 'https://www.roadaffair.com/wp-content/uploads/2020/03/aerial-view-zagreb-croatia-shutterstock_1199253325.jpg'){
      return new Place(
          id,
          title,
          description,
          imageUrl,
          +guestNumber,
          dateFrom,
          dateTo,
          this.authService.userId
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
  private fetchAll(){
      return this.http
          .get<{ name: {
              title: string,
              description: string,
              price: number,
              imageUrl: string,
              userId: string,
              dateFrom: string,
              dateTo: string,
          } }>(environment.api.offers)
          .pipe(
              map(response => {
                  const places: Place[] = [];
                  for(let place in response){
                      const newPlace = this.createPlace(
                          response[place].title,
                          response[place].description,
                          +response[place].price,
                          new Date( response[place].dateFrom ),
                          new Date( response[place].dateTo ),
                          place,
                          response[place].imageUrl,
                      );

                      console.log(newPlace);
                      places.push(newPlace);
                  }
                  console.log(places);
                  return places;
              })
          )
  }
  private update(place: Place){
      return this.http.put(`${environment.api.updateOffer}${place.id}.json`, place);
  }
  private delete(id: string){}
}
