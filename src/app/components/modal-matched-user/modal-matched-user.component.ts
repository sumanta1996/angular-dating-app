import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-matched-user',
  templateUrl: './modal-matched-user.component.html',
  styleUrls: ['./modal-matched-user.component.css']
})
export class ModalMatchedUserComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  @Input() public matchedUser: any;

  ngOnInit(): void {
    console.log(this.matchedUser);
  }

}
