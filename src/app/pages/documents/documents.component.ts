import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../base.component';
import { timer } from 'rxjs';
import {
    InfiniteLoaderComponent,
    InfiniteLoaderConfig,
    MaskComponent,
    PopupComponent,
    PTRComponent,
    PTRConfig,
    ToastService,
    SwiperModule
} from 'ngx-weui';
import { DocumentService } from '../../services/document.service';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import * as moment from 'moment';
import * as _ from 'lodash';
import { LocalStorage } from 'ngx-store';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from "../../services/auth.service";
import { MatTabGroup } from "@angular/material/tabs";
import { Title } from "@angular/platform-browser";
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-documents',
    templateUrl: './documents.component.html',
    styleUrls: ['./documents.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DocumentsComponent extends BaseComponent implements OnInit {

    @ViewChild('mask', { static: true }) mask: MaskComponent;
    loading = false;

    @LocalStorage()
    lang;

    @LocalStorage()
    documentsCategory;

    documentsCategoryTags: any;

    @LocalStorage()
    userInfo: any;

    infiniteConfig: InfiniteLoaderConfig = {
        percent: 10,
    }

    PTRConfig: PTRConfig = {
        treshold: 10,
    }

    @ViewChild('comp', { static: true }) infiniteLoaderComponent: InfiniteLoaderComponent;
    @ViewChild('ptrComponent', { static: true }) ptrComponent: PTRComponent;
    @ViewChild('tabGroup', { static: false }) matTabGroup: MatTabGroup;

    @ViewChild('full', { static: true }) fullPopup: PopupComponent;
    feedbackCategories = [
        { id: 1, cn: '优化建议', en: 'Optimization Suggestions' },
        { id: 2, cn: '界面问题', en: 'UI Issues' },
        { id: 3, cn: '其它问题', en: 'Other Issues' },
    ];
    feedbackCategory = this.feedbackCategories[0].id;
    feedbackContent;
    feedbackPlaceholderCN = '填写你的建议或者反馈';
    feedbackPlaceholderEN = 'Input suggestion or feedback here';

    items: any = [];

    tags: any = [];

    channels: any = [];

    banner = [];

    staticPath = environment.staticApiPrefix;

    images: any[] = [{bannerImg: 'uploadImg/Motiv_B.I1.jpg'},{bannerImg: 'uploadImg/Motiv_D.I.2.jpg'},{bannerImg: 'uploadImg/Motiv_D.III.2.jpg'},{bannerImg: 'uploadImg/Motiv_H.I.2.jpg'}];

    totalCount = 0;
    currentPage = 1;
    pageSize = 10;
    searchContent: any = {
        status: 1,
    };
    tagId = null;
    categoryId = null;

    selected = 0;
    SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

    constructor(
        private translate: TranslateService,
        private router: Router,
        private authService: AuthService,
        private documentService: DocumentService,
        private route: ActivatedRoute,
        private appTitle: Title,
        private toastService: ToastService,
    ) {
        super();
        this.lang = this.translate.currentLang;
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationStart) {
                // Show loading indicator
            }

            // if (event instanceof NavigationEnd) {
            //     // Hide loading indicator
            //     this.categoryId = event.url.split('/')[event.url.split('/').length - 1]
            //     if (this.categoryId === 'dashboard') {
            //         if (this.documentsCategory.length > 0) {
            //             this.categoryId = this.documentsCategory[0].id;
            //         }
            //     }
            //     this.onFilterCategory({ id: this.categoryId });
            //     if (this.documentsCategory instanceof Array) {
            //         _.map(this.documentsCategory, (category, index) => {
            //             if (this.categoryId == category.id) {
            //                 this.selected = index;
            //             }
            //         })
            //     }
            // }
        });
        // this.route.paramMap.subscribe(params => {
        //   this.categoryId = params.get('categoryId');
        //   if (this.categoryId) {
        //     this.onFilterCategory({id: this.categoryId});
        //   }
        // });
    }

    ngOnInit(): void {
        this.initData();
    }


    changeTag(i) {
        this.selected = i;
        this.tagId = this.tags[i].id;
        this.onSelectTag();
    }

    private initData() {
        this.authService.getAccountInfo().subscribe(
            (result: any) => {
                const { code, data, message } = result;
                if (code === '1') {
                    this.userInfo = data;
                }
            },
            error => {
                console.error(error);
            }
        );
        this.documentService.getBanner().subscribe(
            (result: any) => {
                const { code, data, message } = result;
                if (code === 1) {
                    this.images = data;
                }
            },
            error => {
                console.error(error);
            }
        );
        this.documentService.getAllTags().subscribe(
            (result: any) => {
                const { code, data, message } = result;
                if (code === 1) {
                    this.tags = _.filter(data,function(v){return v.status === 1});
                    this.tagId = this.tags[0].id;
                    // window.localStorage.setItem('ngx_documentsCategory', JSON.stringify(data.content));
                    // if (this.categoryId) {
                    //   this.onFilterCategory({id: this.categoryId});
                    // } else {
                    //   this.onFilterCategory(this.documentsCategory[0]);
                    // }
                    this.onSelectTag();
                } else {
                    this.tags = [];
                }
            },
            error => {
                this.tags = [];
                console.error(error);
            }
        );
        this.documentService.getBanner().subscribe(
            (result: any) => {
                const { code, data, message } = result;
                if (code === 1) {
                    this.banner = data;
                }
            },
            error => {
                console.error(error);
            }
        );
    }

    toSection(sectionId){
        this.router.navigate([`/app/section/${sectionId}`]);
    }

    onSelectTag(){
        this.documentService.getChannelByTag(this.tagId).subscribe(
            (result: any) => {
                const { code, data, message } = result;
                if (code === 1) {
                    this.channels = data;
                    // window.localStorage.setItem('ngx_documentsCategory', JSON.stringify(data.content));
                    // if (this.categoryId) {
                    //   this.onFilterCategory({id: this.categoryId});
                    // } else {
                    //   this.onFilterCategory(this.documentsCategory[0]);
                    // }
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
}