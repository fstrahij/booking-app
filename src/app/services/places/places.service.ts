import { Injectable } from '@angular/core';
import {BehaviorSubject, delay, map, take, tap} from "rxjs";

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
    'u1'
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

  addPlace(title: string, description: string, guestNumber: number, dateFrom: Date, dateTo: Date){
      const newPlace = new Place(
          Math.random().toString(),
          title,
          description,
          'https://www.roadaffair.com/wp-content/uploads/2020/03/aerial-view-zagreb-croatia-shutterstock_1199253325.jpg',
          +guestNumber,
          dateFrom,
          dateTo,
          this.authService.userId
      );

      return this._places
          .pipe(
              take(1),
              delay(1000),
              tap(places => this._places.next(places.concat(newPlace)))
          )
  }
}
