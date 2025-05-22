import {Address} from "./map.model";

export interface Coordinates {
    lat: number,
    lng: number
}

export interface PlaceLocation extends Coordinates{
    address: Address,
    imageUrl: string
}