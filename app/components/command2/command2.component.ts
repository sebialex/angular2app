import {Component, Input, Output, EventEmitter, ElementRef} from 'angular2/core';
import {DAOService} from '../../services/dao.service';
import {Item, Property} from '../../util/item';

export class DropdownValue {
  value:string;
  label:string;

  constructor(value:string,label:string) {
    this.value = value;
    this.label = label;
  }
}

enum CommandType {
    action,
    item,
    property,
    price
}

export class SearchCommand {
    
    constructor(
        public value: string, 
        public type: CommandType, 
        public isValid: boolean
        ) {}
}

export class SearchCommandChain {
    action: SearchCommand;
    item: SearchCommand;
    property: SearchCommand;
    price: SearchCommand;
    
    isValid: boolean;
    currentCommand: SearchCommand;
    
    constructor(private daoService: DAOService){    
        this.isValid = false; 
        this.currentCommand = null;         
    }
            
    populate(tokens: string []): void {
        var len = tokens.length;
                        
        this.currentCommand = null;
        
        for (var i = 0; i < len; i++) {
            var command = tokens[i];
             
            if (this.currentCommand == null) {                 
                this.currentCommand = new SearchCommand(command, CommandType.action, this.daoService.isActionValid(command));                 
            }             
            
            if (!this.currentCommand.isValid) {
                this.isValid = false;
                break;
            }
            
            if (this.currentCommand.type == CommandType.action) {                
                this.action = this.currentCommand;
                this.currentCommand = new SearchCommand(command, CommandType.item, this.daoService.isItemValid(command));                
            }
            else if (this.currentCommand.type == CommandType.item) {               
                this.item = this.currentCommand;
                this.currentCommand = new SearchCommand(command, CommandType.property, this.daoService.isPropertyValid(this.item.value, command));                
            }
            else if (this.currentCommand.type == CommandType.property) {                
                this.property = this.currentCommand;
                this.currentCommand = new SearchCommand(command, CommandType.price, true);                
            }
            else if (this.currentCommand.type == CommandType.price) {
                this.price = this.currentCommand;                
            }                          
        } 
        
        console.log("action=" + this.getCommandValue(this.action) + ", item=" + this.getCommandValue(this.item));        
    }
    
    private getCommandValue(command: SearchCommand) {
        if (command == null) {
            return null;
        }
        else {
            return command.value;
        }
    }
    
                    
}

@Component({
	selector: 'command2',
    providers:[DAOService],
	templateUrl: 'app/components/command2/command2.template.html'  
})
export class Command2 {     
    @Input() searchString2: string;
    
    currentCommandString: string;
    
    @Input() values: DropdownValue[];
    @Output() select = new EventEmitter();
    valuesMap = {};
    
    value: string;
    complete: boolean;
    type: string;
        
    results: string [];
    
    action: string;
    item: string;
    property: string;
    price: string;
    commandArray: string [];
    
    commandChain: SearchCommandChain;
    
    constructor(private daoService: DAOService, public elem: ElementRef) {
        this.value = "start";
        this.complete = false;  
        this.searchString2 = "";  
        this.commandArray = [null, null, null, null];   
        this.commandChain = new SearchCommandChain(daoService);           
    }
    
    selectItem(value) {
        //this.select.emit(value);
        console.log(value);
        
        var dropDown = this.valuesMap[value];
        
        if (dropDown) {
           this.searchString2 = dropDown.label;
            this.clearValues();
            this.elem.nativeElement.focus();
        }
    }
    
    onChange(event) {

        this.clearValues();
        
        var searchStr = null;
        
        if (this.searchString2 != null) {
            searchStr = this.searchString2.trim(); 
        }

        var commandStrings = this.getCommandStrings(this.searchString2);

        if (commandStrings == null) {
            return;
        }

       // this.commandArray = [null, null, null, null];
        
        this.commandChain.populate(commandStrings);
                
        //this.setCommandValues(commandStrings);
        //searchStr = commandStrings[commandStrings.length - 1];
        var currentCommand = this.commandChain.currentCommand;
        searchStr = currentCommand.value;
        
        console.log("searchStr=" + searchStr);
        //console.log(this.commandArray.join(","));
        //console.log("searchStr=" + searchStr + ", searchString2=" + this.searchString2);

        var result = null;
        
        if (currentCommand.type == CommandType.action) {                
            result = this.daoService.getActions(searchStr);                           
        }
        else if (currentCommand.type == CommandType.item) {               
            result = this.daoService.getItems(searchStr);              
        }
        else if (currentCommand.type == CommandType.property) {                
            result = this.daoService.getProperties(this.commandChain.item.value, searchStr);         
        }
        else if (currentCommand.type == CommandType.price) {
                     
        }                  
               
        this.populateChoices(result, searchStr);
                  
        //console.log("change");
         //this.results.push(Math.random().toString());
         //this.results = ["buy", "sell", "rent"];
    }
    
    populateChoices(result: string[], searchStr: string): void {
        if (result != null && !(result.length == 1 && result[0] == searchStr)) {   
                   
            for (var i = 0, len = result.length; i < len; i++) {
                var key = "key" + i;
                var dropDown = new DropdownValue(key, result[i]);
                this.valuesMap[key] = dropDown;
                this.values.push(dropDown);
            }          
        }      
    }
    
    setCommandValues(commandStrings: string []) {
        
                  
    }
    
    getCommandStrings(input: string): string []  {
           
        if (input == null || input == "") {
            return null;
        }
           
        var tokens = input.split(' ');
        
        if (tokens == null || tokens.length < 1) {
            return null;
        }
        
        var commandStrings = [];    
        
        // Get command strings only, get rid of whitespace
        for (var i = 0, len = tokens.length, token; i < len; i++) {
             token = tokens[i];            
             if (token == null) {
                continue;
             }
             var trimmedToken = token.trim();             
             commandStrings.push(trimmedToken);              
        }
        
        return commandStrings;
    }
    
    getActionChoices(): string [] {
        return ["sell", "buy", "rent" ];
    }
    
    setType(newValue: string) {
        this.type = newValue;
    }
    
    setValue(newValue: string) {
        this.value = newValue;
        
        if (this.type == "action") {
            this.results = ["buy", "sell"];
        }
        else {
            this.results = ["hmm"];
        }
    }
    
    clearValues() {
        this.values = [];
        this.valuesMap = {};
    }
    
}
