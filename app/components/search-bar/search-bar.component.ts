import {Component, Input, Output, EventEmitter, ElementRef} from 'angular2/core';
import {DAOService} from '../../services/dao.service';
import {SearchCommand, SearchCommandChain, CommandType} from './search-command';

export class DropdownElement {
  value: string;
  label: string;

  constructor(value:string, label:string) {
    this.value = value;
    this.label = label;
  }
}

@Component({
	selector: 'search-bar',
    providers: [DAOService, ElementRef],
	templateUrl: 'app/components/search-bar/search-bar.template.html',
    styleUrls: []
})
export class SearchBar { 
        
    @Input() 
    searchString: string;
    
    @Input()
    returnAllResults: boolean;

    @Input()
    values: DropdownElement[];
    
    valuesMap = {};            
    commandChain: SearchCommandChain;
    
    inputElem = null;
    
    constructor(private daoService: DAOService) {
        this.searchString = null;          
        this.commandChain = new SearchCommandChain(daoService); 
        this.returnAllResults = true;          
    }
    
    selectItem(value) {
        //this.select.emit(value);
        
        
        var dropDown = this.valuesMap[value];

        if (dropDown) {         
            var tokens = this.searchString.split(' ');
            
           
            var currentValue = this.commandChain.currentCommand.value;
            console.log("[currentValue=" + currentValue + "]");
            
            var currentValid = this.commandChain.getValidCommandValues();
            
            if (currentValid == null || currentValid.length == 0) {
                this.searchString = dropDown.label + " ";
            }
            else {
                 console.log("list=[" + currentValid.join(' ') + "]");
                                              
                this.searchString = currentValid.join(' ') + " " + dropDown.label + " ";
                
               
            }
            
            this.clearValues();
    
            if (this.inputElem != null) {
                this.inputElem.focus();
            }          
            this.handleInput(this.searchString, true, true);           
            //if (tokens[tokens.length - 1] == currentValue) {
            //    this.searchString = tokens.join(' ') + " " + dropDown.label;
           // }
            //else {
               // tokens[tokens.length - 1] = dropDown.label;
               // this.searchString = tokens.join(' ') + " ";
          //  }
                                   
           
        }
    }
    
    onKeyUp(event) {
        console.log("onKeyUp");
        if (this.inputElem == null) {
             this.inputElem = event.originalTarget; 
        }                              
        this.handleInput(this.searchString, true, true);                     
    }
    
    onKeyDown(event) {
                
        var strToCheck = null;
        
        var key = event.key;
        
        console.log("key.length=" + key.length);
        
        if (key.length > 1) {
            key = "";
        }
        
        if (this.searchString == null) {
            strToCheck = key;
        }
        else {
            strToCheck = this.searchString + key;
        }
        
        console.log("to stop=" + strToCheck);
        
        var result = this.handleInput(strToCheck, false, false);
        
        console.log("result=" + result);
        
        if (result == null) {
             event.preventDefault();   
        }                      
    }
    
    private handleInput(textLine: string, clearValue: boolean, populateDropDown: boolean): string [] {
              
        if (clearValue) {
             this.clearValues();
        }      
       
        var commandStrings = this.getCommandStrings(textLine);

        if (commandStrings == null) {
            return;
        }

        this.commandChain.populate(commandStrings);
        //console.log("commandChain=" + this.commandChain.toString());
        var currentCommand = this.commandChain.currentCommand;
        
        if (currentCommand == null) {
            return;
        }
        
        var searchStr = currentCommand.value;
        
        //console.log("searchStr=" + searchStr);

        var result = null;
        
        if (currentCommand.type == CommandType.action) {
            if (currentCommand.isValid) {
                 result = this.daoService.getItems(currentCommand.value, this.getEmptySearchItem());
            }
            else {
                result = this.daoService.getActions(searchStr);
            }                                                      
        }
        else if (currentCommand.type == CommandType.item) {
            if (currentCommand.isValid) {
                result = this.daoService.getProperties(this.commandChain.item.value, this.getEmptySearchItem()); 
            }  
            else {
                 result = this.daoService.getItems(this.commandChain.action.value, searchStr);  
            }                                    
        }
        else if (currentCommand.type == CommandType.property) {                
            result = this.daoService.getProperties(this.commandChain.item.value, searchStr);         
        }
        else if (currentCommand.type == CommandType.price) {
            if (this.daoService.isPriceValid(this.commandChain.price.value)) {
               result = [];
            }        
        }
        else if (currentCommand.type == CommandType.end) {
            result = null;
        }
  
        
        if (populateDropDown) {
            this.populateChoices(result, searchStr);
        }
        
        return result;  
    }
            
    private getEmptySearchItem(): string {
        if (this.returnAllResults) {
            return "";
        }
        else {
            return null; 
        }
    }
    
    private populateChoices(result: string[], searchStr: string): void {
        if (result != null && !(result.length == 1 && result[0] == searchStr)) {   
                   
            for (var i = 0, len = result.length; i < len; i++) {
                var key = "key" + i;
                var dropDown = new DropdownElement(key, result[i]);
                this.valuesMap[key] = dropDown;
                this.values.push(dropDown);
            }          
        }      
    }
    
    /**
     * This method takes the given string and splits it into words, ignoring any extra whitespaces
     *  
     * NOTE: Whenever I can I try to decouple utility methods from the object (no this. references) 
     *       in case I want to refactor it later into a separate Util class
     */
    private getCommandStrings(input: string): string []  {
        
        console.log("getCommandStrings=" + input);   
           
        if (input == null || input == "") {
            return null;
        }
           
        var tokens = input.split(' ');
        
        if (tokens == null || tokens.length < 1) {
            return null;
        }
        
        var commandStrings = null;    
        
        // Get command strings only, get rid of whitespace
        for (var i = 0, len = tokens.length, token; i < len; i++) {
             token = tokens[i];            
             if (token == null) {
                continue;
             }
             token = token.trim();
             if (token === '' || token === ' ') {
                 continue;
             }
             
             if (commandStrings == null) {
                commandStrings = []; 
             }
             commandStrings.push(token);              
        }
        
        return commandStrings;
    }
    
    private clearValues() {
        this.values = [];
        this.valuesMap = {};
    }
    
}
