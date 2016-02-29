import {Component} from 'angular2/core';

@Component({
	selector: 'command',
	templateUrl: 'app/components/command/command.template.html'
})
export class Command {     
    _value: string;
    _complete: boolean;
    
    constructor(value :string) {
        this._value = value;
        this._complete = false;
    }
    
    set value(newValue: string) {
        this._value = newValue;
    }
    
    get value(): string {
        return this._value;
    }
    
    set complete(status: boolean) {
        this._complete = status;
    } 
    
    get complete(): boolean {
        return this._complete;
    }   
}
