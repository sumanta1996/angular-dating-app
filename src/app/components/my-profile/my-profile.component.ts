import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/common/user';
import { UserImages } from 'src/app/common/user-images';
import { ConstantData } from 'src/app/constants/constantFile';
import { MyprofileService } from 'src/app/services/myprofile.service';
import { RegistrationService } from 'src/app/services/registration.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  userImagesList: UserImages[] = new Array();
  username!: any;
  loggedinUser!: User;
  isOtherUser!: boolean;
  sexuality!: string;

  constructor(private myProfile: MyprofileService, private regService: RegistrationService,
              private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      if(history.state.user) {
        //Other user profiles
        this.isOtherUser = true;
        this.loggedinUser = history.state.user;
        this.userImagesList = history.state.user.userImages;
        this.updateStateCode();
      }else {
        //Loggedin User
        this.fetchLoggedInUserDetails();
      }
    });
  }

  checkSexuality(user: User) {
    console.log("Yes here: ", user);
    return ConstantData.checkForSexuality(user);
  }

  fetchLoggedInUserDetails() {
    this.isOtherUser = false;
    this.username = sessionStorage.getItem('username');
    //this.fetchAllUserImages();
    this.regService.basicUserDetailsObj.subscribe(data => {
      this.loggedinUser = data;
      this.updateStateCode();
      console.log(data);
      this.userImagesList = data.userImages;
    });
  }

  updateStateCode() {
    let stateCode = this.loggedinUser.livingIn;
      if(stateCode) {
        for(let i=0;i<ConstantData.states.length;i++) {
          if(stateCode === ConstantData.states[i].code) {
            this.loggedinUser.livingIn = ConstantData.states[i];
          }
        }
      }
  }

  /* fetchAllUserImages() {
    if (this.username) {
      this.myProfile.getAllUserImages(this.username).subscribe(data => {
        data.map((each, index) => {
          let tempData = each;
          tempData.processedImage = 'data:image/jpeg;base64,' + tempData.imageData;
          this.userImagesList.push(tempData);
          return each;
        })
      });
    }
  } */

}
