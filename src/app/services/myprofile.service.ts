import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserImages } from '../common/user-images';

@Injectable({
  providedIn: 'root'
})
export class MyprofileService {

  private fetchUserImagesUrl = 'http://localhost:8080/userImages/search/findByUsernameOrderByOrderingAsc?username=';
  private uploadImagesUrl = 'http://localhost:8080/users/uploadImages';
  private setOrderingUrl = 'http://localhost:8080/users/setImageOrdering';

  constructor(private httpClient: HttpClient) { }

  getAllUserImages(username: string): Observable<UserImages[]> {
    return this.httpClient.get<GetResponseUserImages>(this.fetchUserImagesUrl+username).pipe(map(response => response._embedded.userImages));
  }

  uploadImages(formData: FormData): Observable<any> {
    return this.httpClient.post<any>(this.uploadImagesUrl, formData);
  }

  setOrdering(reqBody: any): Observable<any> {
    return this.httpClient.post<any>(this.setOrderingUrl, reqBody);
  }

}

interface GetResponseUserImages {
  _embedded: {
    userImages: UserImages[]
  }
}
