import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewOfferPageRoutingModule } from './new-offer-routing.module';

import { NewOfferPage } from './new-offer.page';
import {EditOfferPageModule} from "../edit-offer/edit-offer.module";
import {LocationPickerComponent} from "../../../../shared/components/location-picker/location-picker.component";
import {MapModalComponent} from "../../../../shared/components/map-modal/map-modal.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonicModule,
        NewOfferPageRoutingModule,
        EditOfferPageModule
    ],
    declarations: [NewOfferPage, LocationPickerComponent, MapModalComponent]
})
export class NewOfferPageModule {}
