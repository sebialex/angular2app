export class Action {     
    _name: string;
    _complete: boolean;
    
    constructor(name :string) {
        this._name = name;
        this._complete = false;
    }
    
    set value(newValue: string) {
        this._name = newValue;
    }
    
    get name(): string {
        return this._name;
    }
    
    set complete(status: boolean) {
        this._complete = status;
    } 
    
    get complete(): boolean {
        return this._complete;
    }   
}