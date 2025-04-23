import { Injectable } from '@angular/core';
import {Place} from "./place.model";

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places : Place[]= [
      new Place('p1', 'Manhatan Mansion', 'In the heart of New York City', 'https://s1.1zoom.me/big3/366/421441-svetik.jpg', 149.99),
      new Place('p2', 'Zagreb', 'Zagreb volim te', 'https://www.roadaffair.com/wp-content/uploads/2020/03/aerial-view-zagreb-croatia-shutterstock_1199253325.jpg', 89.99),
      new Place('p3', 'Ljubljana', 'Ljubljana srce Slovenije', 'https://adventurousmiriam.com/wp-content/uploads/2015/06/Ljubljana.jpg', 99.99),
  ];

  get places(){
    return [...this._places];
  }

  constructor() { }

  getPlace(id: string){
      return { ...this._places.find( p => p.id === id ) };
  }
}
