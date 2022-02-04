import { Component } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private regService: RegistrationService, private router: Router) {}

  ngOnInit(): void {
    this.regService.basicUserDetailsObj.subscribe(data => {
      this.loggedInUser = data;
    });

    if(this.regService.isLoggedIn()) {
      console.log('User auto logged in');
      //Fetch Basic Details
      this.regService.fetchBasicDetails().subscribe(data => {
        
      }, err => {
        console.log(err);
        this.regService.logout();
      });
      
      //this.router.navigateByUrl('/my-profile');
      this.router.navigateByUrl('/users');
    }else {
      //Redirect to login
      console.log('User not auto logged in');
      this.regService.logout();
    }
  }

  isLoggedIn() {
    return this.regService.isLoggedIn();
  }

  logout() {
    this.regService.logout();
  }
}
