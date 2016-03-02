import {bootstrap} from 'angular2/platform/browser';
import {Angular2AppComponent} from './components/angular2app/angular2app.component';
import {SearchBar} from './components/search-bar/search-bar.component';
bootstrap(Angular2AppComponent).catch(err => console.error(err));
