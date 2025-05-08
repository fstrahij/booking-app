import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {Router} from "@angular/router";

import {LoadingController} from "@ionic/angular";

@Component({
  selector: 'app-offer-form',
  templateUrl: './offer-form.component.html',
  styleUrls: ['./offer-form.component.scss'],
  standalone: false
})
export class OfferFormComponent  implements OnInit, OnChanges {
  @Input() message?: string = 'Loading...';
  @Input() isLoading?: boolean = false;
  @Input() isChangePage?: boolean = false;

  @Input() form: FormGroup;
  @Output() formChange = new EventEmitter<FormGroup>();

  constructor(private loadingCtrl: LoadingController,
              private router: Router,) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);

    for(let change in changes) {
      switch(change) {
        case 'isLoading':
          if(changes['isLoading'].previousValue === undefined && !changes['isLoading'].currentValue) break;

          this.showLoader();

          break;
        case 'isChangePage':
          if(!this.isChangePage) break;

          this.changePage();

          break;
        default: break;
      }
    }
  }

  showLoader(){
    if(this.isLoading){
      this.loadingCtrl
          .create({
            keyboardClose: true,
            message: this.message
          })
          .then(loading =>  loading.present());
    }
    else this.loadingCtrl?.dismiss();
  }

  changePage(){
    this.isLoading = false;
    //this.form.reset();
    this.router.navigate(['/', 'places', 'tabs', 'offers']);
  }

}
