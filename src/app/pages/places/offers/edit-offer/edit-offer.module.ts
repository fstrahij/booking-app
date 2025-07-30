import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditOfferPageRoutingModule } from './edit-offer-routing.module';

import { EditOfferPage } from './edit-offer.page';
import {OfferFormComponent} from "../../../../shared/components/offer-form/offer-form.component";
import {LocationPickerComponent} from "../../../../shared/components/location-picker/location-picker.component";
import { ClusterPointDirective } from "@maplibre/ngx-maplibre-gl";
import { ImagePickerComponent } from 'src/app/shared/components/image-picker/image-picker.component';

@NgModule({
    imports: [
    CommonModule,
    IonicModule,
    EditOfferPageRoutingModule,
    ReactiveFormsModule,
    ClusterPointDirective
],
    exports: [
        OfferFormComponent,
        LocationPickerComponent,
        ImagePickerComponent
    ],
    declarations: [
        EditOfferPage, 
        OfferFormComponent, 
        LocationPickerComponent,
        ImagePickerComponent
    ]
})
export class EditOfferPageModule {}
