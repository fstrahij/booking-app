import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlacesPageRoutingModule } from './places-routing.module';

import { PlacesPage } from './places.page';
import {CreateBookingComponent} from "../../components/create-booking/create-booking.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PlacesPageRoutingModule,
        ReactiveFormsModule
    ],
  declarations: [PlacesPage, CreateBookingComponent]
})
export class PlacesPageModule {}
