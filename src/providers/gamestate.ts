import { Injectable } from '@angular/core';

@Injectable()
export class GameState {

  journal:string[] = [""];
  journal_index:number = 0;

  options:Option[] = []

  constructor() {}

  start():void {
    this.addJournalEntry("You wake up in a room.")
    this.setOptions(
      [
        { link_text : "Look around", on_chosen : ()=>this.inspect() },
        { link_text : "Go back to sleep", on_chosen : ()=>this.sleep() },
        { link_text : "...", on_chosen : ()=>{} },
        { link_text : "(Reflect on your life)", on_chosen : ()=>this.test() },
      ]
    )
  }

  getLastJournalEntry():string
  {
    return this.journal[this.journal_index]
  }
  
  test():void {
    this.addJournalEntry("In facilisis scelerisque dui vel dignissim. Sed nunc orci, ultricies congue vehicula quis, facilisis a orci. In aliquet facilisis condimentum. Donec at orci orci, a dictum justo. Sed a nunc non lectus fringilla suscipit. Vivamus pretium sapien sit amet mauris aliquet eleifend vel vitae arcu. Fusce pharetra dignissim nisl egestas pretium.")
  }

  inspect():void {
    let a = ["It's a nice room.","It's not a big room","Not much is in this room","Is that a door?\nNo.\nI think it's somebody's umbrella.\n\nI hate pickles..."]
    let i = Math.floor(Math.random()*a.length)
    
    this.addJournalEntry(a[(i)])
  }

  sleep():void {
    let $this = this
    this.addJournalEntry("You sleep.")
    this.setOptions(
      [
        { link_text : ">>", on_chosen : ()=>step2() },
      ]
    )

    function step2()
    {
      $this.addJournalEntry("And you sleep.")
      $this.setOptions(
        [
          { link_text : ">>", on_chosen : ()=>step3() },
        ]
      )
    }

    function step3()
    {
      $this.addJournalEntry("And...")
      $this.setOptions(
        [
          { link_text : ">>", on_chosen : ()=>$this.start() },
        ]
      )
    }
  }

  addJournalEntry(s:string):void {
    this.journal.push(s)
    this.journal_index++
    console.log(s)
  }

  setOptions(list:Option[]):void {
    this.options = list
  }

  selectOption(index:number):void {
    console.log("chose option "+index)
    try {
      this.options[index].on_chosen()
    }
    catch(e) {
      console.log(e)
    }
  }
}

class Option
{
  link_text:string
  on_chosen:()=>void
}