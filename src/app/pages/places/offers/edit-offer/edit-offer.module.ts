import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditOfferPageRoutingModule } from './edit-offer-routing.module';

import { EditOfferPage } from './edit-offer.page';
import {OfferFormComponent} from "../../../../shared/components/offer-form/offer-form.component";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        EditOfferPageRoutingModule,
        ReactiveFormsModule
    ],
    exports: [
        OfferFormComponent
    ],
    declarations: [EditOfferPage, OfferFormComponent]
})
export class EditOfferPageModule {}
