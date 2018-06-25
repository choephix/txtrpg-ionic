import { Injectable  } from '@angular/core';

@Injectable()
export class GameState {
  
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

  get_Time():string { return this.context ? this.context["global"]["time"] : "?" }
  
  private enterNode( node_id:string ):void {
    
    this.current_node_id = node_id
    
    let node_data = this.context.nodes[node_id];
    
    if ( "visits" in node_data && node_data["visits"] > 0 )
    {
      this.addJournalEntry(this,this.random(node_data["on_enter"]));
      node_data["visits"]++
    }
    else
    {
      console.log(node_data["on_enter_first_time"])
      this.addJournalEntry(node_data["on_enter_first_time"]);
      node_data["visits"] = 1
    }
    
    let options = [];
    
    if ( "on_look" in node_data )
    {
      options.push( { 
        link_text : this.random(["Look around","Inspect "+node_data.title]), 
        on_chosen : ()=>this.addJournalEntry(this.random(node_data.on_look))
      } );
    }
    
    if ( "actions" in node_data ) for ( let action of node_data.actions )
    {
      options.push( { 
        link_text : action.handle as string, 
        on_chosen : ()=>this.performAction( action.on_do, options ) 
      } )
    }
    
    for ( let exit of node_data.exits )
    {
      options.push( { 
        link_text : exit.handle as string, 
        on_chosen : ()=>this.enterNode( exit.node ) 
      } )
    }
    
    options.push( { link_text : "(Reflect on your life)", on_chosen : ()=>{} } );
      
    this.setOptions( options );
  }
  
  private performAction(journalEntries:string[],options:Option[]):void {
    
    journalEntries = Object.assign([], journalEntries)
    
    let next:()=>void = () => {
      this.context["global"]["time"] += 0.50 + Math.random();
      this.addJournalEntry( journalEntries.shift() );
      if ( journalEntries.length > 0 )
        this.setOptions( [ { link_text : ">>", on_chosen : ()=>next() } ] )
      else
        this.setOptions( options )
    }
    
    next();
  }

  private addJournalEntry(s:string):void {
    if( this.current_journal_entry != undefined )
      this.journal.push(this.current_journal_entry)
    this.current_journal_entry = s;
    console.log(":: " + s)
  }

  private random(s:string[]):string 
  { return s[Math.floor(Math.random()*s.length)] }

  private setOptions(list:Option[]):void {
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