import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
  standalone: false
})
export class NewOfferPage implements OnInit {
  form: FormGroup;

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
      price: new FormControl(null, [Validators.required, Validators.min(1)]),
      dateFrom: new FormControl(null, Validators.required),
      dateTo: new FormControl(null, Validators.required),
    })
  }

  onCreateOffer(){
    console.log(this.form);
  }
}
