import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewOfferPageRoutingModule } from './new-offer-routing.module';

import { NewOfferPage } from './new-offer.page';
import {EditOfferPageModule} from "../edit-offer/edit-offer.module";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonicModule,
        NewOfferPageRoutingModule,
        EditOfferPageModule
    ],
  declarations: [NewOfferPage]
})
export class NewOfferPageModule {}
