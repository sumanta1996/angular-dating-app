import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Conversation } from '../common/conversation';
import { User } from '../common/user';
import { ConstantData } from '../constants/constantFile';
import { ConversationsService } from '../services/conversations.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-conversation-screen',
  templateUrl: './conversation-screen.component.html',
  styleUrls: ['./conversation-screen.component.css']
})
export class ConversationScreenComponent implements OnInit {

  user!: User;
  message = '';
  userMessages!: Conversation[];
  timerInterval!: any;
  username!: any;
  showLoader!: boolean;

  constructor(private route: Router, private router: ActivatedRoute, private usersService: UsersService, 
    private convService: ConversationsService) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe(() => {
      this.username = sessionStorage.getItem('username');
      this.user = history.state.user;
      this.userMessages = [];

      //Subscribe to user messages
      this.convService.userMessages.subscribe(data => {
        this.userMessages = data;
      });

      //Adding this here so that for the first time it fetches quickly and not after 4secs.
      this.convService.fetchMessages(this.user.conversationId).subscribe();

      //Every 4sec it will fetch messages
      /* this.timerInterval = setInterval(() => {
        this.convService.fetchMessages(this.user.conversationId).subscribe();
      }, 4000); */

      let livingInObj = ConstantData.states.find(state => state.code === this.user.livingIn);
      this.user.livingIn = livingInObj;
    });
  }

  ngOnDestroy() {
    //Remove Interval
    //clearInterval(this.timerInterval);
  }

  closeConversationScreen() {
    this.usersService.userClickedIndex.next(-1);
    this.convService.activatedUsername.next('');
    this.route.navigateByUrl('/users');
  }

  onTyping(event: any) {
    this.message = event.target.value;
  }

  triggerMessage() {
    let conv = new Conversation();
    conv.message = this.message;
    conv.dateCreated = new Date();
    conv.username = this.username;
    this.userMessages = [conv, ...this.userMessages];
    this.showLoader = true;
    this.message = ''; //Resetting message
    this.convService.saveMessage(this.user.conversationId, conv.message).subscribe(resp => {
      console.log(resp);
      this.showLoader = false;
      this.convService.fetchAllMessages().subscribe();
      this.usersService.fetchAllUserMatches().subscribe();
    }, err => {
      console.log(err);
      this.showLoader = false;
    });
  }

  validateToShowDate(currentObj: Conversation, prevObj: any) {
    if(!prevObj) {
      //This scenario is for index = 0.
      return true;
    }else if(currentObj && prevObj) {
      let currTimestamp = new Date(currentObj.dateCreated);
      let prevTimestamp = new Date(prevObj.dateCreated);

      //if date matches then return false else show date
      return !(currTimestamp.getDate() === prevTimestamp.getDate());
    }else {
      //Will never reach this condition
      return false;
    }
  }

}
