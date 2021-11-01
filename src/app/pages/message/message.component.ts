import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MessageComponent extends BaseComponent implements OnInit {

    list: any[] = [{
        avatar: '../img/avatar.jpg',
        name: '软件社区',
        content: '您关注的软件社区发布了新的帖子'
    }, {
        avatar: '../img/avatar.jpg',
        name: '材料社区',
        content: '您关注的材料社区发布了新的帖子'
    }, {
        avatar: '../img/avatar.jpg',
        name: '仿真社区',
        content: '您关注的仿真社区发布了新的帖子'
    }];


    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) {
        super();
    }

    ngOnInit(): void {
        this.initData();
    }

    private initData() {}
}