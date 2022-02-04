import { Component, OnInit } from '@angular/core';
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

  constructor(private myProfile: MyprofileService, private regService: RegistrationService) { }

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username');
    this.fetchAllUserImages();
    this.regService.basicUserDetailsObj.subscribe(data => {
      this.loggedinUser = data;
      let stateCode = this.loggedinUser.livingIn;
      if(stateCode) {
        for(let i=0;i<ConstantData.states.length;i++) {
          if(stateCode === ConstantData.states[i].code) {
            this.loggedinUser.livingIn = ConstantData.states[i];
          }
        }
      }
    });
  }

  fetchAllUserImages() {
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
  }

}
