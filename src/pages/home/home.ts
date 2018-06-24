// import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Component, AfterViewInit } from '@angular/core';
import { GameState } from '../../providers/gamestate';
import * as data from '../../mock-world.json';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit {
  
  // @ViewChild("scr") scroll_journal:ElementRef;
  // @ViewChild("jcontent") content_journal:ElementRef;

  constructor( public game:GameState ) {}

  ionViewDidEnter() {
  }
  
  ngAfterViewInit() {
    this.game.on_change = this.update;
    this.game.start(data);
  }
  
  private update():void {
    // console.log(this.scroll_journal)
    // console.log(this.scroll_journal)
    // this.scroll_journal.scrollToBottom();
    // this.content_journal.scrollToBottom();
  }
}