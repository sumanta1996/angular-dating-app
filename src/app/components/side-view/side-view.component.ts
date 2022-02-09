import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Conversation } from 'src/app/common/conversation';
import { User } from 'src/app/common/user';
import { UserImages } from 'src/app/common/user-images';
import { ConversationsService } from 'src/app/services/conversations.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-side-view',
  templateUrl: './side-view.component.html',
  styleUrls: ['./side-view.component.css']
})
export class SideViewComponent implements OnInit {

  tabs = ['Matches', 'Messages'];
  activeIndex = 0;
  allMatches!: User[];
  allMessages!: any[];
  userClickedIndex = -1;
  activatedUsername!: string; 

  constructor(private usersService: UsersService, private convService: ConversationsService,
          private route: Router) { }

  ngOnInit(): void {
    this.fetchAllMatches();
    this.usersService.userClickedIndex.subscribe(data => {
      this.userClickedIndex = data;
    });
    this.convService.activatedUsername.subscribe(data => {
      this.activatedUsername = data;
    });
  }

  tabSwitched(index: number) {
    this.activeIndex = index;
    //For Matches part forget the clicked index
    this.usersService.userClickedIndex.next(-1);
    //If activeIndex === 'Messages' then fetch all messages
    if(this.activeIndex === 1) {
      this.convService.fetchAllMessages().subscribe();
      this.convService.allMessages.subscribe(response => {
        this.allMessages = response;
      })
    }
  }

  fetchAllMatches() {
    this.usersService.fetchAllUserMatches().subscribe(
      err => {
        console.log(err);
      }
    );
    //Subscription to the subject
    this.usersService.allMatches.subscribe(response => {
      response.map(user => {
        if(user.userImages) {
          this.processImageData(user.userImages);
        }

        return user;
      });
      this.allMatches = response;
    });
  }

  processImageData(userImages: UserImages[]) {
    userImages.sort((a,b) => (a.ordering > b.ordering) ? 1 : ((b.ordering > a.ordering) ? -1 : 0));

    return userImages;
  }

  openConversationScreen(user: User, index: number) {
    console.log(user);
    this.usersService.userClickedIndex.next(index);
    //this.userClickedIndex = index;
    this.navigateToConversationScreen(user);
  }

  openConversationScreenFromMessages(index: number, username: string, conversationId: number, matchedDate: Date) {
    this.convService.activatedUsername.next(username);

    this.usersService.fetchBasicUserDetailsBasedOnUsername(username).subscribe(data => {
      let userData: User = data;
      userData.conversationId = conversationId;
      userData.matchedDate = matchedDate;
      this.usersService.fetchUserImagesBasedOnUsername(data._links.userImages.href).subscribe(data => {
        userData.userImages = data;
        this.navigateToConversationScreen(userData);
      });
    })
  }

  navigateToConversationScreen(user: User) {
    this.route.navigateByUrl('/conversation/'+user.username, {
      state: {
        user: user
      }
    });
  }

}
