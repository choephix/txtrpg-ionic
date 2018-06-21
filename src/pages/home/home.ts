import { Component } from '@angular/core';
import { GameState } from '../../providers/gamestate';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor( public game:GameState ) {}

  ionViewDidEnter() {
    this.game.start();
  }
}