import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseData } from '../common/response-data';
import { User } from '../common/user';
import { UserImages } from '../common/user-images';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private allUsersUrl = 'http://localhost:8080/basicUserDetails/';
  private allUsersForMatchingUrl = 'http://localhost:8080/users/findAll';
  private swipeRight = 'http://localhost:8080/users/swipeRight';
  private genderSpecificUsers = this.allUsersUrl+'search/findByGender?gender=';
  private fetchAllMatchesUrl = 'http://localhost:8080/users/fetchAllMatches';

  allMatches: Subject<User[]> = new ReplaySubject<User[]>();
  userClickedIndex: Subject<number> = new BehaviorSubject<number>(-1);

  constructor(private httpClient: HttpClient) { }

  getAllUsersList(): Observable<User[]> {
    return this.httpClient.get<GetResponseUsers>(this.allUsersUrl).pipe(map(response => response._embedded.basicUserDetail));
  }

  getAllUsersListForMatching(): Observable<User[]> {
    return this.httpClient.get<GetResponseUsersForMatching>(this.allUsersForMatchingUrl).pipe(map(response => response.data));
  }

  swipeRightToLike(usernameSwiped: string): Observable<ResponseData> {
    return this.httpClient.post<ResponseData>(this.swipeRight, {usernameSwiped: usernameSwiped});
  }

  editBasicUserData(user: User, username: string): Observable<any> {
    return this.httpClient.patch<any>(this.allUsersUrl+username, user);
  }

  fetchAllUserMatches(): Observable<any> {
    return this.httpClient.get<any>(this.fetchAllMatchesUrl).pipe(map(data => {
      this.allMatches.next(data);
    }));
  }

  fetchBasicUserDetailsBasedOnUsername(username: string): Observable<any> {
    return this.httpClient.get<any>(this.allUsersUrl+username);
  }

  fetchUserImagesBasedOnUsername(userImagesUrl: string): Observable<UserImages[]> {
    return this.httpClient.get<GetResponseUserImages>(userImagesUrl).pipe(map(response => response._embedded.userImages));
  }
}

interface GetResponseUsers {
  _embedded: {
    basicUserDetail: User[]
  }
}

interface GetResponseUsersForMatching {
  data: User[]
}

interface GetResponseUserImages {
  _embedded: {
    userImages: UserImages[]
  }
}
