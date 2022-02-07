import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, ReplaySubject, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginUser } from '../common/login-user';
import { User } from '../common/user';
import { UserImages } from '../common/user-images';

const headers = new HttpHeaders().set('Content-Type', 'application/json');

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private authUrl = "http://localhost:8080/auth/";
  private basicUserDetailsUrl = "http://localhost:8080/basicUserDetails/";
  private fetchLoggedinUserImage = "http://localhost:8080/users/fetchFirstImage";
  private fetchBasicDetailsWithImage = "http://localhost:8080/users/fetchBasicUserDetails";

  basicUserDetailsObj: Subject<User> = new ReplaySubject<User>();

  constructor(private httpClient: HttpClient, private router: Router) { }

  public loginUserFromRemote(username: string, password: string): Observable<any> {

    return this.httpClient.post<any>(this.authUrl + "login", { username: username, password: password }, { headers })
      .pipe(catchError(this.handleError),
        map(userData => {
          sessionStorage.setItem("username", username);
          let tokenStr = "Bearer " + userData.token;
          console.log("Token---  " + tokenStr);
          sessionStorage.setItem("token", tokenStr);
          let userObj = userData.basicUserDetails;
          userObj.userImages = this.processImageData(userObj.userImages);
          this.basicUserDetailsObj.next(userObj);
          return userData;
        }));
  }

  processImageData(userImages: UserImages[]) {
    userImages.sort((a,b) => (a.ordering > b.ordering) ? 1 : ((b.ordering > a.ordering) ? -1 : 0));
    /* for(let i=0;i<userImages.length;i++) {
      userImages[i].imageData = 'data:image/jpeg;base64,'+userImages[i].imageData;
    } */

    return userImages;
  }

  public registerUser(regUser: LoginUser): Observable<any> {
    
    return this.httpClient.post<any>(this.authUrl+"signup", regUser, { headers })
        .pipe(catchError(this.handleError),
        map(userdata => {
          console.log("User signed up", userdata);
          this.router.navigateByUrl('/login');
          return userdata;
        }));
  }

  handleError(httpError: HttpErrorResponse) {
    let message: string = '';

    if (httpError.error instanceof ProgressEvent) {
      console.log('in progrss event')
      message = "Network error";
    }
    else {
      message = httpError.error.message;
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${httpError.status}, ` +
        `body was: ${httpError.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(message);

  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem('username') !== null;
  }

  fetchBasicDetails(): Observable<any> {
    let url = this.fetchBasicDetailsWithImage;
    console.log('Auto login user : ',url);
    return this.httpClient.get<any>(url).pipe(catchError(this.handleError), 
      map(data => {
        console.log(data);
        let userObj = data.basicUserDetails;
        userObj.userImages = this.processImageData(userObj.userImages);
        this.basicUserDetailsObj.next(userObj);
      }));
  }

  /* fetchFirstImage(): Observable<any> {
    return this.httpClient.get<any>(this.fetchLoggedinUserImage);
  } */

  logout() {
    sessionStorage.clear();
    this.httpClient.post<any>(this.authUrl + 'logout', {});
    this.basicUserDetailsObj.next(new User());
    this.router.navigate(['/login']);
  }
}
