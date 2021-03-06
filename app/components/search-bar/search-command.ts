/**
 * Author: Sebastian Stanisor
 */
import {DAOService} from '../../services/dao.service';

/**
 * Types of commands
 */
export enum CommandType {
    action,
    item,
    property,
    price,
    end
}

/**
 * This is a container for a Search command. It is used as a state.
 */
export class SearchCommand {
    
    constructor(
        public value: string, 
        public type: CommandType, 
        public isValid: boolean
        ) {}
        
    toString(): string {
        return "[type: " + this.type + ", value="+ this.value + ", isValid=" + this.isValid + "]";
    }
}

/**
 * The command state machine.
 */
export class SearchCommandChain {
    action: SearchCommand;
    item: SearchCommand;
    property: SearchCommand;
    price: SearchCommand;
    end: SearchCommand;      
    currentCommand: SearchCommand;
    
    constructor(private daoService: DAOService){           
        this.currentCommand = null;         
    }
    
    clean(): void {
        this.currentCommand = null;      
        this.action = null;
        this.item = null;
        this.property = null;
        this.price = null;
        this.end = null;
    }
          
    /**
     * Populates all the states given the input strings  
     */  
    populate(tokens: string []): void {
        
        this.clean();
                              
        for (var i = 0, len = tokens.length; i < len; i++) {
            var command = tokens[i];
            if (this.currentCommand == null) {                 
                this.currentCommand = new SearchCommand(command, CommandType.action, this.daoService.isActionValid(command));
                if (this.currentCommand.isValid) {                    
                    this.action = this.currentCommand;
                }                                              
            } 
            else {
                this.handleCommand(command);
            }                                                                        
        }                
    }
    
    /**
     *  Returns a list of the values of all the currently valid commands 
     */   
    getValidCommandValues(): string [] {
        
        var result = [];
        
        if (this.action != null && this.action.isValid) {
            result.push(this.action.value);
        }
        
        if (this.item != null && this.item.isValid) {
            result.push(this.item.value);
        }
        
        if (this.property != null && this.property.isValid) {
            result.push(this.property.value);
        }
        
        if (this.price != null && this.price.isValid) {
            result.push(this.price.value);
        }

        return result;        
    }
    
    toString(): string {
        return "{current=" + this.commandToStr(this.currentCommand) + ", all=" + 
        this.commandToStr(this.action) + this.commandToStr(this.item) + this.commandToStr(this.property) + this.commandToStr(this.price) +"}";
    }
    
    /**
     * Handles the given input string and figures out which state to go next
     */
    private handleCommand(command: string) {
        if (!this.currentCommand.isValid) {                
            return;
        } 
        
        if (this.currentCommand.type == CommandType.action) {                                     
            this.currentCommand = new SearchCommand(command, CommandType.item, this.daoService.isItemValid(this.action.value, command));  
            if (this.currentCommand.isValid) {   
                this.item = this.currentCommand;
            }               
        }
        else if (this.currentCommand.type == CommandType.item) {               
            this.item = this.currentCommand;         
            this.currentCommand = new SearchCommand(command, CommandType.property, this.daoService.isPropertyValid(this.item.value, command));
            if (this.currentCommand.isValid) {   
                this.property = this.currentCommand;
            }                
        }
        else if (this.currentCommand.type == CommandType.property) {                                      
            this.currentCommand = new SearchCommand(command, CommandType.price, true);   
            if (this.currentCommand.isValid) {   
                this.price = this.currentCommand;
            }              
        }
        else if (this.currentCommand.type == CommandType.price) {            
            this.currentCommand = new SearchCommand(command, CommandType.end, true);
            this.end = this.currentCommand;        
        }  
    }
    
    /**
     * Gets the string representation of the given command or returns "[null]"
     * if the given command is null
     */
    private commandToStr(command: SearchCommand) {
        if (command == null) {
            return "[null]";
        }
        else {
            return command.toString();
        }
    }                        
}