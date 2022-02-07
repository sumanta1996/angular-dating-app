import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../common/user';
import { ConstantData } from '../constants/constantFile';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-conversation-screen',
  templateUrl: './conversation-screen.component.html',
  styleUrls: ['./conversation-screen.component.css']
})
export class ConversationScreenComponent implements OnInit {

  user!: User;
  message = '';

  constructor(private route: Router, private router: ActivatedRoute, private usersService: UsersService) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe(() => {
      this.user = history.state.user;
      let livingInObj = ConstantData.states.find(state => state.code === this.user.livingIn);
      this.user.livingIn = livingInObj;
    })
  }

  closeConversationScreen() {
    this.usersService.userClickedIndex.next(-1);
    this.route.navigateByUrl('/users');
  }

  onTyping(event: any) {
    this.message = event.target.value;
  }

  triggerMessage() {
    console.log(this.message);
  }

}
