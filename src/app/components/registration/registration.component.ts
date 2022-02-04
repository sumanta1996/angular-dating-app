import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUser } from 'src/app/common/login-user';
import { User } from 'src/app/common/user';
import { RegistrationService } from 'src/app/services/registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  regForm!: FormGroup;
  allGenders = [
    new GenderData('M', 'Male'),
    new GenderData('F', 'Female')
  ];
  errorMsg!: string;

  constructor(private formBuilder: FormBuilder, private route: Router, private regService: RegistrationService) { }

  ngOnInit(): void {
    this.regForm = this.formBuilder.group({
      emailId: new FormControl('', [Validators.required, Validators.minLength(2)]),
      username: new FormControl('', [Validators.required, Validators.minLength(2)]),
      password: new FormControl('', [Validators.required, Validators.minLength(2)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(2)]),
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      age: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
      gender: new FormControl('', [Validators.required]),
      selfSummary: new FormControl('', [Validators.required, Validators.minLength(2)])
    }, {validators: this.passwordChecks});
  }
  
  passwordChecks: ValidatorFn = (group: AbstractControl): ValidationErrors => {
    let password = group.get('password');
    let confirmPassword = group.get('confirmPassword');

    if(password && confirmPassword && password.value !== confirmPassword.value) {
      return {noMatch: true};
    }

    return {};
  }

  get f() { return this.regForm.controls; }

  registerUser() {
    if(this.regForm.invalid) {
      this.regForm.markAllAsTouched();
      return;
    }else {
      let user = new User();
      user.username = this.regForm.controls['username'].value,
      user.firstName = this.regForm.controls['firstName'].value,
      user.lastName = this.regForm.controls['lastName'].value,
      user.age = this.regForm.controls['age'].value,
      user.gender = this.regForm.controls['gender'].value.abbr,
      user.selfSummary = this.regForm.controls['selfSummary'].value
      let regReq = new LoginUser(this.regForm.controls['emailId'].value,
                                this.regForm.controls['username'].value,
                                this.regForm.controls['password'].value,
                                user);
      console.log('Registration: ', regReq);
      this.regService.registerUser(regReq).subscribe(data => {
        console.log("Success: ", data);
      }, error => {
        console.log("Error: ", error);
        this.errorMsg = error;
        if(this.errorMsg.includes('Username')) {
          this.regForm.controls['username'].setValue('');
        }
        if(this.errorMsg.includes('Email')) {
          this.regForm.controls['emailId'].setValue('');
        }
      });
    }
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
