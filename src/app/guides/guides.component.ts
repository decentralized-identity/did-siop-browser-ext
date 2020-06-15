import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-guides',
  templateUrl: './guides.component.html',
  styleUrls: ['./guides.component.scss']
})
export class GuidesComponent implements OnInit {

  @Output() clickedBack = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  goBack(){
    this.clickedBack.emit(true);
  }

}
