import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersComponent } from './components/users/users.component';
import { LowerUltilityTabComponent } from './components/lower-ultility-tab/lower-ultility-tab.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './interceptor/AuthInterceptor';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SideViewComponent } from './components/side-view/side-view.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ModalMatchedUserComponent } from './components/modal-matched-user/modal-matched-user.component';

const routes: Routes = [
  {path: 'users', component: UsersComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'my-profile', component: MyProfileComponent},
  {path: 'profile', component: MyProfileComponent},
  {path: 'edit-profile', component: EditProfileComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    LowerUltilityTabComponent,
    LoginComponent,
    RegistrationComponent,
    MyProfileComponent,
    EditProfileComponent,
    SideViewComponent,
    ModalMatchedUserComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    DragDropModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatTabsModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
