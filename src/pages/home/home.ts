import { Component, AfterViewInit } from '@angular/core';
import { GameState } from '../../providers/gamestate';
import * as data from '../../data/mock-world.json';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit {
  
  constructor( public game:GameState ) {}

  ngAfterViewInit() {
    this.game.start(data);
  }
}

///
/// [ ] Add basic NPCs?
/// [ ] Add items you can have and not have
/// [ ] Add conditions to (node) actions
/// [ ] 
///