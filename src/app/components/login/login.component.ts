import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUser } from 'src/app/common/login-user';
import { RegistrationService } from 'src/app/services/registration.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  msg!: string;

  constructor(private regService: RegistrationService, 
            private formBuilder: FormBuilder,
            private route: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: new FormControl('', [Validators.required, Validators.minLength(2)]),
      password: new FormControl('', [Validators.required, Validators.minLength(2)])
    });
  }

  get f() { return this.loginForm.controls; }

  loginUser(): void {
    
    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }else {
      this.regService.loginUserFromRemote(this.loginForm.controls['username'].value, 
                                          this.loginForm.controls['password'].value).subscribe(
        data => {
          console.log("Response recieved", data);
          this.route.navigateByUrl('/users');
        },
        error => {
          console.log("Exception Occured", error);
          this.msg = error;
        }
      );
    }
  }

}
