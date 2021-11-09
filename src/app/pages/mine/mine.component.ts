import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MineService } from '../../services/mine.service';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { LocalStorage } from 'ngx-store';
import * as base64 from 'base-64';
import * as _ from 'lodash';
import { DialogComponent, DialogConfig, PopupComponent } from "ngx-weui";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'app-mine',
    templateUrl: './mine.component.html',
    styleUrls: ['./mine.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MineComponent extends BaseComponent implements OnInit {

    @LocalStorage()
    lang;

    @LocalStorage()
    userInfo;
    config: DialogConfig = {};

    personalData = {
        chineseName: ''
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private mineService: MineService,
        private meta: Meta,
        private appTitle: Title,
        private domSanitizer: DomSanitizer,
    ) {
        super();
        console.info(this.userInfo);
    }


    ngOnInit(): void {
        this.initData();
    }

    private initData() {
        this.mineService.getPersonalInfo().subscribe(
            (result: any) => {
                const { code, data, message } = result;
                if (code === 1) {
                    this.personalData = data.companyUserSimple;
                }
            },
            error => {
                console.error(error);
            }
        );
    }

    toArticle(type) {
        this.router.navigate([`/app/article-list/${type}`]);
    }

}