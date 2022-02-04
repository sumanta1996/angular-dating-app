import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { User } from './common/user';
import { RegistrationService } from './services/registration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-dating-app';
  loggedInUser!: User;
  imageData!: any;
  isAppStarting: boolean = false;

  constructor(private regService: RegistrationService, private router: Router) {
   }

  ngOnInit(): void {
    console.log('App starting');
    this.isAppStarting = true;
    if (this.regService.isLoggedIn()) {
      console.log('User auto logged in');
      //Fetch Basic Details
      this.regService.fetchBasicDetails().subscribe(data => {

      }, err => {
        console.log(err);
        this.regService.logout();
      });
    } else {
      //Redirect to login
      console.log('User not auto logged in');
      this.regService.logout();
    }

    this.regService.basicUserDetailsObj.subscribe(data => {
      this.loggedInUser = data;
      console.log(data);
      if (data && data.userImages && data.userImages.length > 0) {
        //Fetch the first image for profile picture.
        this.imageData = data.userImages[0].imageData;
      } else {
        //Resetting this imageData if it's undefined.
        this.imageData = undefined;
      }
      //If App is starting and user is auto logged in then only check redirect url inside subscription.
      if(this.isAppStarting && this.regService.isLoggedIn()) {
        this.checkRedirectUrl();
        this.isAppStarting = false;
      }
    });
    if(!this.isAppStarting) {
      this.checkRedirectUrl();
    }
  }

  checkRedirectUrl() {  
    if (this.imageData) {
      this.router.navigateByUrl('/users');
    } else {
      //New User
      this.router.navigateByUrl('/edit-profile')
    }
  }

  isLoggedIn() {
    return this.regService.isLoggedIn();
  }

  logout() {
    this.regService.logout();
  }
}
