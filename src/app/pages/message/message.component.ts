import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import { MessageService } from '../../services/message.service';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MessageComponent extends BaseComponent implements OnInit {

    list: any[] = [];


    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) {
        super();
    }

    ngOnInit(): void {
        this.initData();
    }

    private initData() {
        this.messageService.getMyList().subscribe(
            (result: any) => {
                const { code, data, message } = result;
                if (code == 1) {
                    this.list = data;
                }
            },
            error => {
                console.error(error);
            }
        );
    }
}