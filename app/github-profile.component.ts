import {Component, Pipe, PipeTransform, OnInit} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';
import {HTTP_PROVIDERS} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import {GitHubService} from './github.service';

@Pipe({name: 'values'})

export class ValuesPipe implements PipeTransform {
    transform(value: any, args?: any[]): Object[] {
        let keyArr = Object.keys(value),
            dataArr = [],
            keyName = args[0];

        keyArr.forEach(key => {
            value[key][keyName] = key;
            dataArr.push(value[key])
        });

        if(args[1]) {
            dataArr.sort((a: Object, b: Object): number => {
                return a[keyName] > b[keyName] ? 1 : -1;
            });
        }

        return dataArr;
    }
}

@Component({
	selector: 'github-profile',
	styles: [
		`
			.avatar {
				width: 100;
				height: 100;
				border-radius: 100%;
			}
		`
	],
	template: `
		<i *ngIf="isLoading" class="fa fa-spinner fa-spin fa-3x"></i>
		<h2>@{{ user.login }}</h2>
		<img class="avatar" src="{{ user.avatar_url }}">

		<h3>Followers</h3>

		<div *ngFor='#follower of followers | values:"key":true' class="media">
			<div class="media-left">
				<a href="#">
					<img src="{{ follower.avatar_url }}" alt="" class="media-object avatar" />
				</a>
			</div>
			<div class="media-body">
				<h4 class="media-heading">
					{{ follower.login }}
				</h4>
			</div>
		</div>
	`,
	providers: [HTTP_PROVIDERS, GitHubService],
	pipes: [ValuesPipe],
	directives: [NgFor, NgIf]
})

export class GitHubProfileComponent implements OnInit {
	isLoading = true;
	username = "UvaPrakash";
	user = {};
	followers = {};

	constructor(private _gitHubService: GitHubService){}

	ngOnInit() {
		Observable.forkJoin(
			this._gitHubService.getUser(this.username),
			this._gitHubService.getFollowers(this.username)
		)
		.subscribe(
			res => {
				this.user = res[0];
				this.followers = res[1];
			},
			null,
			() => { this.isLoading = false; }
		)
	}
}
