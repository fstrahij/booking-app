import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewOfferPageRoutingModule } from './new-offer-routing.module';

import { NewOfferPage } from './new-offer.page';
import {EditOfferPageModule} from "../edit-offer/edit-offer.module";
import {MapModalComponent} from "../../../../shared/components/map-modal/map-modal.component";
import {MapComponent} from "@maplibre/ngx-maplibre-gl";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonicModule,
        NewOfferPageRoutingModule,
        EditOfferPageModule,
        MapComponent
    ],
    declarations: [NewOfferPage, MapModalComponent]
})
export class NewOfferPageModule {}
