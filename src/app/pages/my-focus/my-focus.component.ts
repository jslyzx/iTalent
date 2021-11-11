import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../base.component';
import { SectionService } from '../../services/section.service';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import { LocalStorage } from 'ngx-store';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'my-focus-documents',
    templateUrl: './my-focus.component.html',
    styleUrls: ['./my-focus.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MyFocusComponent extends BaseComponent implements OnInit {

    staticPath = environment.staticApiPrefix;

    channels: any = [];

    constructor(
        private router: Router,
        private sectionService: SectionService,
        private route: ActivatedRoute
    ) {
        super();
    }

    ngOnInit(): void {
        this.initData();
    }

    private initData() {
        this.sectionService.getMyFocus().subscribe(
            (result: any) => {
                const { code, data, message } = result;
                if (code === 1) {
                    this.channels = data;
                } else {
                    this.channels = [];
                }
            },
            error => {
                this.channels = [];
                console.error(error);
            }
        );
    }

    toSection(sectionId){
        this.router.navigate([`/app/section/${sectionId}`]);
    }
}