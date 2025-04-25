import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {LoadingController} from "@ionic/angular";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: false
})
export class AuthPage implements OnInit {
  isLoading = false;

  constructor(private authService: AuthService,
              private router: Router,
              private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
  }

  onLogin(){
    this.isLoading = true;

    this.loadingCtrl
        .create({
          keyboardClose: true,
          message:'Loading...'
        })
        .then(el => {
          el.present();
          this.authService.login();

          setTimeout(()=> {
            this.isLoading = false;
            el.dismiss();
            this.router.navigateByUrl('/places/tabs/discover');
          }, 1500);
        });
  }
}
