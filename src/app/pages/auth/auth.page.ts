import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {LoadingController} from "@ionic/angular";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: false
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(private authService: AuthService,
              private router: Router,
              private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {
  }

  login(){
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

  onSubmit(f: NgForm){
    if(!f.valid) return;

    const email = f.value.email;
    const password = f.value.password;

    console.log(email, password);

    if(this.isLogin)
    {
      this.login();
    }else{

    }
  }

  onSwitchAuthMode(){
    this.isLogin = !this.isLogin;
  }
}
