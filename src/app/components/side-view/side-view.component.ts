import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/common/user';
import { UserImages } from 'src/app/common/user-images';
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
  userClickedIndex = -1;

  constructor(private usersService: UsersService, private route: Router) { }

  ngOnInit(): void {
    this.fetchAllMatches();
    this.usersService.userClickedIndex.subscribe(data => {
      this.userClickedIndex = data;
    });
  }

  tabSwitched(index: number) {
    this.activeIndex = index;
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
    this.route.navigateByUrl('/conversation/'+index, {
      state: {
        user: user
      }
    });
  }

}
