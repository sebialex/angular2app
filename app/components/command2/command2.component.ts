import {Component} from 'angular2/core';
import {DAOService} from '../../services/dao.service';


@Component({
	selector: 'command',
	templateUrl: 'app/components/command/command.template.html'  
})
export class Command {     
    value: string;
    complete: boolean;
    type: string;
        
    results: string [];
    
    constructor(value :string) {
        this.value = value;
        this.complete = false;
       //his.results = daoService.getActions(value);
       
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
    
}
