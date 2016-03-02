import {Component, Input, Output, OnChanges} from 'angular2/core';
import {Command} from '../command/command.component'
import {Command2} from '../command2/command2.component'
import {DAOService} from '../../services/dao.service';

@Component({
	selector: 'search-bar',
	templateUrl: 'app/components/search-bar/search-bar.template.html',
    providers:[DAOService],
    directives: [Command2]
})
export class SearchBar { 
    @Input() searchString: string;
    prevSearchString: string;
    otherString: string;
    
    commands: Command [];
    daoService: DAOService;
    command2: Command2;
    
    
    constructor(daoService: DAOService) {
        this.searchString = null; 
        this.prevSearchString = this.searchString;       
        this.commands = [];
        this.otherString = this.commands.length.toString();
        this.daoService = daoService;               
    }
    
    onChange(event) {
        
        var commandStrings = this.getCommandStrings(this.searchString);
        
        var currentText = this.searchString.replace(/'a'/g, '');
        this.searchString = currentText;
                        
        var currentText = currentText.replace(/ /g, '');
       
        this.commands = [];
       
        for (var i = 0, len = commandStrings.length; i < len; i++) {                       
            var cmd = new Command(commandStrings[i]);      
            if (i == 0) {
                cmd.setType("action");
            }     
            this.commands.push(cmd);
        }
       
                
        if (this.commands.length == 0) {
            //var cmd = new Command(currentText, this.daoService);
            
           // this.commands.push(cmd);
            
            //this.otherString = this.getActionChoices().join(",");
        }
        else {
                        
            var changeIndex = this.getIndexOfChange(currentText, this.prevSearchString);
            
            this.otherString = "stuff";
            
            for (var i = 0, len = this.commands.length; i < len; i++) {
            
            }
        }
                       
        //this.otherString = this.testString.replace(/ /g, '');
        
        this.prevSearchString = currentText;
        //console.log(commandStrings);
    }     
    
    
    
    getIndexOfChange(input: string, prevInput: string) : number {
       
       var index = -1;
       var len;
                    
       if (input.length >= prevInput.length) {
           len = prevInput.length;
       }
       else {
           len = input.length;
       }
     
       for (var i = 0; i < len; i++) {
            index = i;
            if (input[i] != prevInput[i]) {
                break;
            }
       }
       
       return index;   
    }
    
    /**
     * This method takes the given string and splits it into words, ignoring any extra whitespaces
     *  
     * NOTE: Whenever I can I try to decouple utility methods from the object (no this. references) 
     *       in case I want to refactor it later into a separate Util class
     */
    getCommandStrings(input: string): string []  {
        var commandStrings = [];        
        var tokens = input.split(' ');
        
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
       
}
