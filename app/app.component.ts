import {Component} from 'angular2/core';
import {GitHubProfileComponent} from './github-profile.component';

@Component({
    selector: 'my-app',
    template: '<github-profile></github-profile>',
    directives: [GitHubProfileComponent]
})

export class AppComponent { }
