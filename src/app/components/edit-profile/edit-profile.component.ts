import { Component, OnInit } from '@angular/core';
import { UserImages } from 'src/app/common/user-images';
import { MyprofileService } from 'src/app/services/myprofile.service';
import { RegistrationService } from 'src/app/services/registration.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { ToasterNotifyService } from 'src/app/services/toaster-notify.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/common/user';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { ConstantData } from 'src/app/constants/constantFile';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  userImagesList: UserImages[] = new Array(6);
  username!: any;
  loggedinUser!: User;
  editForm!: FormGroup;
  allGenders = [
  new GenderData('M', 'Male'),
    new GenderData('F', 'Female')
  ];
  states = ConstantData.states;
  sexuality = ConstantData.sexuality;

  constructor(private myProfile: MyprofileService, private regService: RegistrationService, 
    private toasterNotifyService: ToasterNotifyService, private userService: UsersService,
    private router: Router, private formBuilder: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log(this.sexuality);
    this.route.paramMap.subscribe(() => {
      console.log('Edit Profile activated.');
      this.editForm = this.formBuilder.group({
        gender: new FormControl(''),
        selfSummary: new FormControl('', [Validators.required, Validators.minLength(2)]),
        jobTitle: new FormControl(''),
        company: new FormControl(''),
        schoolName: new FormControl(''),
        livingIn: new FormControl(''),
        sexuality: new FormControl('')
      });
      this.username = sessionStorage.getItem('username');
      this.regService.basicUserDetailsObj.subscribe(data => {
        console.log(data);
        this.loggedinUser = data;
        this.fetchAllUserImages(data.userImages);
        //Pre-populating data for edit
        this.editForm.controls['selfSummary'].setValue(data.selfSummary);
        let gendObj = this.allGenders.find(gend => gend.abbr === data.gender);
        this.editForm.controls['gender'].setValue(gendObj);
        this.editForm.controls['jobTitle'].setValue(data.jobTitle);
        this.editForm.controls['company'].setValue(data.company);
        this.editForm.controls['schoolName'].setValue(data.schoolName);
        this.editForm.controls['sexuality'].setValue(ConstantData.sexuality.find(each => each.code === data.sexuality));

        let stateObj;
        if(data.livingIn && data.livingIn.code) {
          //If it comes from my-profile then it is already set so just the set object data
          stateObj = data.livingIn;
        }else {
          //Otherwise set the object data
          stateObj = this.states.find(state => state.code === data.livingIn);
        }
        this.editForm.controls['livingIn'].setValue(stateObj);
      });
    });
  }

  get f() { return this.editForm.controls; }

  fetchAllUserImages(userImages: UserImages[]) {
    if(userImages) {
      userImages.map((user, i) => {
        this.userImagesList[i] = user;
        return user;
      });
    }else {
      this.userImagesList = new Array(6);
    }
  }

  onFileChanged(event: any, i: number) {
    let imageData = event.target.files[0];
    const respBody = new FormData();
    respBody.append('doc', imageData);
    respBody.append('id', new Blob([this.userImagesList[i] ? this.userImagesList[i].id.toString() : '0'], { type: 'application/json'}));

    this.myProfile.uploadImages(respBody).subscribe(
      resData => {
        console.log(resData);
        this.toasterNotifyService.processToasterMessage(resData);
        //this.fetchAllUserImages();
        this.regService.fetchBasicDetails().subscribe(
          resData => {
            console.log(resData);
          }, 
          err => {
          console.log(err);
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.userImagesList, event.previousIndex, event.currentIndex);
  }

  save() {
    if(this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.toasterNotifyService.failToaster('Please resolve the errors to proceed.', 'Failure');
      return;
    }else {
      this.setImagesOrdering();
      this.editUser();
      this.router.navigateByUrl('/my-profile');
    }

  }

  editUser() {
    let user = new User();
    user.selfSummary = this.editForm.controls['selfSummary'].value;
    user.gender = this.editForm.controls['gender'].value.abbr;
    user.jobTitle = this.editForm.controls['jobTitle'].value;
    user.company = this.editForm.controls['company'].value;
    user.schoolName = this.editForm.controls['schoolName'].value;
    user.livingIn = this.editForm.controls['livingIn'].value? this.editForm.controls['livingIn'].value.code: null;
    user.sexuality = this.editForm.controls['sexuality'].value? this.editForm.controls['sexuality'].value.code: null;

    if(this.validateEditData(user)) {
      //If data changes then hit db
      this.userService.editBasicUserData(user, this.username).subscribe(
        resData => {
          console.log(resData);
          this.regService.fetchBasicDetails().subscribe(
            resData => {
              console.log(resData);
            }, 
            err => {
            console.log(err);
          });
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  validateEditData(user: User) {
    return !(this.compareEquality(user.selfSummary, this.loggedinUser.selfSummary) &&
        this.compareEquality(user.gender, this.loggedinUser.gender) &&
        this.compareEquality(user.jobTitle, this.loggedinUser.jobTitle) &&
        this.compareEquality(user.company, this.loggedinUser.company) &&
        this.compareEquality(user.schoolName, this.loggedinUser.schoolName) &&
        this.compareEquality(user.livingIn, this.loggedinUser.livingIn) &&
        this.compareEquality(user.sexuality, this.loggedinUser.sexuality))
  }

  compareEquality(str1: string, str2: string) {
    //If data is null or undefined then just assign it as empty string
    if(!str1) {
      str1 = '';
    }

    if(!str2) {
      str2 = '';
    }

    return str1 === str2;
  }

  setImagesOrdering() {
    let reqBody = new Array();
    this.userImagesList.map((user, index) => {
      if(user) {
        reqBody.push({id: user.id, order: index+1});
      }
      return user;
    });
    this.myProfile.setOrdering(reqBody).subscribe(
      resData => {
        this.toasterNotifyService.processToasterMessage(resData);
      },
      err => {
        console.log(err);
      }
    )
  }

}

class GenderData {
  abbr!: string;
  displayName!: string;

  constructor(abbr: string, displayName: string) {
    this.abbr = abbr;
    this.displayName = displayName;
  }
}
