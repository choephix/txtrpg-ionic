import { Injectable  } from '@angular/core';

@Injectable()
export class GameState {
  
  public on_change:()=>void;
  
  journal:string[] = [];
  current_journal_entry:string;

  options:Option[] = []
  
  context = null;
  
  current_node_id:string = null;
  
  public start(data:object):void {
    
    this.context = data;
    console.log("Context:",this.context);
    
    this.addJournalEntry(this.context.start.report);
    
    this.enterNode(this.context.start.node);
  }

  getLastJournalEntry():string { return this.journal[this.journal_index] }
  
  private reset():void {
    
    this.enterNode( this.current_node_id );
  }
  
  private enterNode( node_id:string ):void {
    
    this.current_node_id = node_id
    
    let node_data = this.context.nodes[node_id];
    
    this.addJournalEntry(node_data.on_first_entry);
    
    let options = [];
    
    if ( "on_look" in node_data )
      options.push( { link_text : "Inspect "+node_data.title, on_chosen : ()=>this.addJournalEntry(node_data.on_look) } );
    
    for ( let exit of node_data.exits )
    {
      options.push( { 
        link_text : exit.handle as string, 
        on_chosen : ()=>this.enterNode( exit.node ) 
      } )
    }
    
    options.push( { link_text : "...", on_chosen : ()=>{} } );
    options.push( { link_text : "(Reflect on your life)", on_chosen : ()=>this.sleep() } );
      
    this.setOptions( options );
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
          { link_text : ">>", on_chosen : ()=>$this.reset() },
        ]
      )
    }
  }

  addJournalEntry(s:string):void {
    
    if( this.current_journal_entry != undefined )
      this.journal.push(this.current_journal_entry)
    this.current_journal_entry = s;
    console.log(":: " + s)
    
    try { this.on_change() }
    catch(e) { console.log(e) }
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