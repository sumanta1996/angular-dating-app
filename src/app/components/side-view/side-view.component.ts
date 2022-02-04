import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/common/user';
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

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.fetchAllMatches();
  }

  tabSwitched(index: number) {
    this.activeIndex = index;
  }

  fetchAllMatches() {
    this.usersService.fetchAllUserMatches().subscribe(
      response => {
        this.allMatches = response;
      },
      err => {
        console.log(err);
      }
    );
  }

}
