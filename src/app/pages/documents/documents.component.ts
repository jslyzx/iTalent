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

    images: any[] = [
        'https://ss2.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/5d6034a85edf8db18e821f720a23dd54564e7473.jpg',
        'https://ss2.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/5d6034a85edf8db18e821f720a23dd54564e7473.jpg',
        'https://ss2.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/5d6034a85edf8db18e821f720a23dd54564e7473.jpg'
    ];

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

    // swipe(eType) {
    //   if (eType === this.SWIPE_ACTION.LEFT && this.selected < this.documentsCategory.length - 1) {
    //     this.selected++;
    //     this.onTapTab({index: this.selected});
    //   } else if (eType === this.SWIPE_ACTION.RIGHT && this.selected > 0) {
    //     this.selected--;
    //     this.onTapTab({index: this.selected});
    //   }
    // }

    onLoadMore(comp: InfiniteLoaderComponent) {
        timer(500).subscribe(() => {
            if (this.items.length >= this.totalCount) {
                comp.setFinished();
                return;
            } else {
                this.currentPage += 1;
                this.loadDocuments(true);
            }
        });
    }

    onRefresh(ptr: PTRComponent) {
        timer(800).subscribe(() => {
            this.currentPage = 1;
            this.loadDocuments();
            this.showLoadMore();
            if (this.lang === 'en') {
                ptr.setFinished('Last Update：' + moment().format('YYYY-MM-DD HH:mm:ss'));
            } else {
                ptr.setFinished('上次刷新：' + moment().format('YYYY-MM-DD HH:mm:ss'));
            }
        });
    }

    onDetail(document) {
        switch (document.currentType) {
            case 1:
                this.router.navigate([`/app/pdf/${document.id}`]);
                break;
            case 2:
                this.router.navigate([`/app/doc/${document.id}`]);
                break;
            case 3:
                window.location.href = document.link;
                break;
            case 4:
                this.router.navigate([`/app/image/${document.id}`]);
                break;
            default:
                break;
        }
    }

    onSearch(term: string) {
        // console.log(term);
        // this.searchContent.fileNameCn = term;
        // this.currentPage = 1;
        // this.loadDocuments();
    }

    onCancel() {
        this.searchContent.fileNameCn = null;
        this.currentPage = 1;
        this.loadDocuments();
    }

    onClear() {
        this.searchContent.fileNameCn = null;
        this.currentPage = 1;
        this.loadDocuments();
    }

    onSubmit(value: string) {
        this.searchContent.fileNameCn = value;
        this.currentPage = 1;
        this.loadDocuments();
    }

    chooseTag(tag) {
        if (tag.id !== this.tagId) {
            this.tagId = tag.id;
        } else {
            this.tagId = null;
        }
        this.searchContent.tagId = this.tagId;
        this.loadDocuments();
    }

    changeTag(i) {
        this.selected = i;
    }

    onFilterCategory(category) {
        if (!category) {
            return;
        }
        this.documentService.getDocumentCategoryTagByCategoryId(category.id, { status: 1 }).subscribe(
            (result: any) => {
                const { code, data, message } = result;
                if (code === '1') {
                    this.documentsCategoryTags = data ? data : [];
                }
            },
            (error: any) => {
                console.error(error);
                // this.toastService.show(error);
            }
        )
        this.searchContent.categoryId = parseInt(category.id, 0);
        this.currentPage = 1;
        this.infiniteLoaderComponent && this.infiniteLoaderComponent.restart();
        this.showLoadMore();
        this.loadDocuments();
    }

    onChangeCategory(category: any) {
        if (this.categoryId == category.id) {
            return;
        }
        this.items = [];
        this.documentsCategoryTags = [];
        this.searchContent.tagId = null;
        this.tagId = null;
        this.router.navigate(['/app/documents/', category.id])
    }

    onTapTab(event: any) {
        console.log(event);
        const category = this.documentsCategory[event.index];
        // this.onFilterCategory(category);
        this.router.navigate(['/app/documents/', category.id])
    }

    onCloseFeedbackDialog() {
        this.fullPopup.hide();
        this.feedbackCategory = this.feedbackCategories[0].id;
        this.feedbackContent = '';
    }

    onSubmitFeedback() {
        const params = {
            category: this.feedbackCategory,
            content: this.feedbackContent,
            title: this.feedbackCategory
        };
        this.authService.createFeedback(params).subscribe(
            (result: any) => {
                const { code, data, message } = result;
                if (code === '1') {
                    this.onCloseFeedbackDialog();
                }
                this.toastService.show(message);
            }, error => {
                console.error(error);
                this.toastService.show(error);
            }
        );
    }

    generateThumbnail(doc: any) {
        if (doc.titleImage) {
            return `https://gw-hrupdate.schaefflercn.com/view/download/${doc.id}/title/image?scale=0.4`;
        } else {
            return './assets/images/example-logo.png';
        }
    }

    onChangeLanguage(lang) {
        if (this.lang === lang) {
            return;
        }
        this.lang = lang;
        this.loadDocuments();
        localStorage.setItem('ngx_lang', lang);
        this.lang = localStorage.getItem('ngx_lang');
        this.translate.use(lang);
        this.translate.get('TITLE').subscribe((value => {
            this.appTitle.setTitle(value);
        }));
    }

    private showLoadMore() {
        const loadMoreElement: any = document.getElementsByClassName('weui-loadmore')[0];
        if (loadMoreElement) {
            loadMoreElement.style.display = 'block';
        }
    }

    private loadDocuments(isLoadMore ? ) {
        // this.mask.show();
        // this.loading = true;
        this.searchContent.lang = this.lang === 'en' ? 1 : 0;
        this.documentService.getDocumentByPageAndSize(this.currentPage, this.pageSize, this.searchContent).subscribe(
            (result: any) => {
                // setTimeout(() => {
                //   this.mask.hide();
                //   this.loading = false;
                // }, 600);
                const { code, data, message } = result;
                if (code === '1') {
                    if (!isLoadMore) {
                        this.items = data.content ? data.content : [];
                        this.totalCount = data.totalElements;
                        this.hiddenLoadMore();
                    } else {
                        if (data.content) {
                            this.items = this.items.concat(data.content);
                            this.totalCount = data.totalElements;
                            this.infiniteLoaderComponent.resolveLoading();
                            this.infiniteLoaderComponent.setFinished();
                        }
                    }
                }
            }, error => {
                // setTimeout(() => {
                //   this.mask.hide();
                //   this.loading = false;
                // }, 600);
                console.error(error);
            }
        );
    }

    private hiddenLoadMore() {
        const loadMoreElement: any = document.getElementsByClassName('weui-loadmore')[0];
        if (loadMoreElement) {
            loadMoreElement.style.display = 'none';
        }
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
        this.documentService.getAllTags().subscribe(
            (result: any) => {
                const { code, data, message } = result;
                if (code === 1) {
                    this.tags = data;
                    // window.localStorage.setItem('ngx_documentsCategory', JSON.stringify(data.content));
                    // if (this.categoryId) {
                    //   this.onFilterCategory({id: this.categoryId});
                    // } else {
                    //   this.onFilterCategory(this.documentsCategory[0]);
                    // }
                } else {
                    this.tags = [];
                }
            },
            error => {
                this.tags = [];
                console.error(error);
            }
        );
        this.documentService.getChannelByTag().subscribe(
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