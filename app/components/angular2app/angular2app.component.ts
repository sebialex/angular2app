/**
 * Author: Sebastian Stanisor
 */
import {Component} from 'angular2/core';
import {SearchBar} from '../search-bar/search-bar.component';

/**
 * This is the main app Component 
 */
@Component({
	selector: 'angular2app',
	templateUrl: 'app/components/angular2app/angular2app.template.html',
    styleUrls: ['app/components/angular2app/angular2app.style.css'],
    directives: [SearchBar]
})
export class Angular2AppComponent { 
    constructor() {}
}
