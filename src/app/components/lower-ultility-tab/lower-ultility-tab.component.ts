import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-lower-ultility-tab',
  templateUrl: './lower-ultility-tab.component.html',
  styleUrls: ['./lower-ultility-tab.component.css']
})
export class LowerUltilityTabComponent implements OnInit {
  @Output() lowerTabEvents = new EventEmitter<Object>();
  @Input() currIndex: number = -1; 

  constructor() { }

  ngOnInit(): void {
  }

  chooseIcon(identifier: string): void {
    this.lowerTabEvents.emit({
      identifier: identifier,
      currIndex: this.currIndex
    });
  }

}
