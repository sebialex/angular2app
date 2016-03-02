import {Component} from 'angular2/core';
import {SearchBar} from './search-bar/search-bar.component';

@Component({
	selector: 'angular2app',
	templateUrl: 'app/components/angular2app.template.html',
    directives: [SearchBar]
})
export class Angular2AppComponent { 
    constructor() {}
}
