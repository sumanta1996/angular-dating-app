import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Conversation } from '../common/conversation';

@Injectable({
  providedIn: 'root'
})
export class ConversationsService {
  convsUrl = 'http://localhost:8080/convs/';

  userMessages: Subject<Conversation[]> = new ReplaySubject<Conversation[]>();
  allMessages: Subject<any[]> = new ReplaySubject<any[]>();
  activatedUsername: Subject<string> = new ReplaySubject<string>();

  constructor(private httpClient: HttpClient) { }

  fetchMessages(conversationId: number): Observable<any> {
    return this.httpClient.post<any>(this.convsUrl+'fetchMessages', {conversationId: conversationId}).pipe(map(data => {
      this.userMessages.next(data);
    }));
  }

  saveMessage(conversationId: number, message: string): Observable<any> {
    return this.httpClient.post<any>(this.convsUrl+'saveMessage', {conversationId: conversationId, message: message});
  }

  fetchAllMessages(): Observable<any> {
    return this.httpClient.get<any>(this.convsUrl+'fetchAllMessages').pipe(map(response => {
      this.allMessages.next(response);
    }));
  }
  
}
