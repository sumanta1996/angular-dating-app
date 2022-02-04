import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/common/user';
import { UserImages } from 'src/app/common/user-images';
import { RegistrationService } from 'src/app/services/registration.service';
import { UsersService } from 'src/app/services/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalMatchedUserComponent } from '../modal-matched-user/modal-matched-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  cardIndex: number = -1;
  userInMemory!: User;
  tempUser!: User;
  matchStr!: string;
  matchedUser!: any;
  action!: number;

  constructor(private usersService: UsersService, private authService: RegistrationService,
    private route: ActivatedRoute, private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
    //This runs everytime route parameter changes
    this.route.paramMap.subscribe((() => {
      this.getUsersList();
    }));

    //this.matchedUser = new User('aesha', 'Aesha', '', 25, 'F', 'Hey! Wassup?');
  }

  getUsersList(): void {
    this.usersService.getAllUsersListForMatching().subscribe(response => {
      console.log(response);
      this.users = response;
    }, error => {
      this.authService.logout();
    })
  }

  processImageData(userImages: UserImages[]) {
    userImages.sort((a,b) => (a.ordering > b.ordering) ? 1 : ((b.ordering > a.ordering) ? -1 : 0));
    for(let i=0;i<userImages.length;i++) {
      userImages[i].imageData = 'data:image/jpeg;base64,'+userImages[i].imageData;
    }

    return userImages;
  }

  performOperation(event: any): void {
    this.action = +event.identifier;
    console.log(this.action);
    this.cardIndex = event.currIndex;
    this.tempUser = this.users[this.cardIndex];

    if(event.identifier === '2') {
      //Saving the user in memory so that if you hit on replay we can get the user back. Only applicable if user swipes cancel.
      this.userInMemory = this.tempUser;
    }

    /*
    1: Replay
    2: Cancel
    3: Like 
    */
    if(event.identifier === '3' || event.identifier === '2') { //Like or cancel
      setTimeout(() => {
        this.users.pop();
      }, 300);
    }

    if(event.identifier === '3') {
      //If somebody likes then hit database
      this.handleSwipeRight();
    }
  }

  handleSwipeRight() {
    this.usersService.swipeRightToLike(this.tempUser.username).subscribe(
      response => {
        if(response.code === 3) { //It's a Match
          this.matchStr = response.message;
          this.matchedUser = response.data;
          this.openModal();
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  removeMatchedUser() {
    this.matchStr = '';
    this.matchedUser = null;
  }

  clickInfo(user: User) {
    this.router.navigateByUrl("/profile", {
      state: {
        user: user
      }
    });
  }

  openModal() {
    const modalRef = this.modalService.open(ModalMatchedUserComponent, { centered: true, modalDialogClass: 'matched-content' });
    modalRef.componentInstance.matchedUser = this.matchedUser;
  }

}
