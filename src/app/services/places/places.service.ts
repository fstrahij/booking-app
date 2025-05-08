import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, delay, forkJoin, map, Observable, take, tap} from "rxjs";

import {Place} from "../../models/place.model";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
        new Place(
            'p1',
            'Manhatan Mansion',
            'In the heart of New York City',
            'https://s1.1zoom.me/big3/366/421441-svetik.jpg',
            149.99,
            new Date('2025-06-06'),
            new Date('2025-12-31'),
            'u1'
        ),
        new Place(
            'p2',
            'Zagreb',
            'Zagreb volim te',
            'https://www.roadaffair.com/wp-content/uploads/2020/03/aerial-view-zagreb-croatia-shutterstock_1199253325.jpg',
            89.99,
            new Date('2025-06-06'),
            new Date('2025-12-31'),
            'u2 '
        ),
        new Place(
            'p3',
            'Ljubljana',
            'Ljubljana srce Slovenije',
            'https://adventurousmiriam.com/wp-content/uploads/2015/06/Ljubljana.jpg',
            99.99,
            new Date('2025-06-06'),
            new Date('2025-12-31'),
            'u1'
        ),
    ]);

  get places(){
    return this._places.asObservable();
  }

  constructor(private authService: AuthService) { }

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

      return this._places
          .pipe(
              take(1),
              delay(1000),
              tap(places => this._places.next(places.concat(newPlace)))
          )
  }

  updatePlace(id: string, title: string, description: string, guestNumber: number, dateFrom: Date, dateTo: Date){
      const newPlace = this.createPlace(title, description, guestNumber, dateFrom, dateTo, id);

      return forkJoin([
              this.getPlaceIndex(id),
              this._places.pipe(take(1))
          ])
          .pipe(
              delay(2000),
              map(data => {

                  console.log('tusam', data);
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

  createPlace(title: string, description: string, guestNumber: number, dateFrom: Date, dateTo: Date, id?: string){
      return new Place(
          id || Math.random().toString(),
          title,
          description,
          'https://www.roadaffair.com/wp-content/uploads/2020/03/aerial-view-zagreb-croatia-shutterstock_1199253325.jpg',
          +guestNumber,
          dateFrom,
          dateTo,
          this.authService.userId
      );
  }
}
