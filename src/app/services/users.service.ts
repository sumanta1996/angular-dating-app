import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseData } from '../common/response-data';
import { User } from '../common/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private allUsersUrl = 'http://localhost:8080/basicUserDetails/';
  private allUsersForMatchingUrl = 'http://localhost:8080/users/findAll';
  private swipeRight = 'http://localhost:8080/users/swipeRight';
  private genderSpecificUsers = this.allUsersUrl+'search/findByGender?gender=';

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

  /* getUsersListGenderWise(gender: string) {
    return this.httpClient.get<GetResponseUsers>(this.genderSpecificUsers+gender).pipe(map(response => response._embedded.basicUserDetail));
  } */
}

interface GetResponseUsers {
  _embedded: {
    basicUserDetail: User[]
  }
}

interface GetResponseUsersForMatching {
  data: User[]
}
