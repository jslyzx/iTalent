import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {LocalStorage} from 'ngx-store';
import {Router} from '@angular/router';
import {EventBusService} from 'ngx-eventbus';
import {AuthService} from '../../services/auth.service';
import {WXService} from '../../services/wx.service';
import {ActionSheetComponent, ActionSheetConfig, PopupComponent, ToastService, ToptipsService} from 'ngx-weui';
import {BaseComponent} from '../base.component';
import {DocumentService} from '../../services/document.service';
import {environment} from '../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {DomSanitizer, Title} from '@angular/platform-browser';

declare var wx: any;


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('ios', {static: true}) iosAS: ActionSheetComponent;
  @ViewChild('full', {static: true}) fullPopup: PopupComponent;

  feedbackCategories = [
    {id: 1, cn: '优化建议', en: 'Optimization Suggestions'},
    {id: 2, cn: '界面问题', en: 'UI Issues'},
    {id: 3, cn: '其它问题', en: 'Other Issues'},
  ];
  feedbackCategory = this.feedbackCategories[0].id;
  feedbackContent;
  feedbackPlaceholderCN = '填写你的建议或者反馈';
  feedbackPlaceholderEN = 'Input suggestion or feedback here';

  menus: any[] = [{text: '中文', value: 'zh-CN'}, {text: 'English', value: 'en'}];
  config: ActionSheetConfig = {
    skin: 'ios',
    cancel: '取消',
    title: '语言切换'
  } as ActionSheetConfig;
  configEn: ActionSheetConfig = {
    skin: 'ios',
    cancel: 'Cancel',
    title: 'Language Change'
  } as ActionSheetConfig;

  @LocalStorage()
  lang;
  @LocalStorage()
  code: string;
  @LocalStorage()
  authToken: any;
  @LocalStorage()
  userInfo: any;

  recentDocuments = [];
  @LocalStorage()
  documentsCategory = [];
  staticPath = environment.staticApiPrefix;

  callLib: any;

  constructor(
    public translate: TranslateService,
    private router: Router,
    private eventBusService: EventBusService,
    private toastService: ToastService,
    private authService: AuthService,
    private wxService: WXService,
    private documentService: DocumentService,
    private srv: ToptipsService,
    private appTitle: Title,
    private domSanitizer: DomSanitizer,
  ) {
    super();
    if (!this.lang) {
      this.lang = this.translate.currentLang;
    }
    this.wxService.config({});
    wx.ready(() => {
      wx.hideAllNonBaseMenuItem();
    });
  }

  byPassSecurityHTML(html) {
    return this.domSanitizer.bypassSecurityTrustHtml(html);
  }

  ngOnInit(): void {
    // if (this.code && !this.authToken) {
    //   this.authService.getAccessTokenByCode(this.code).subscribe(
    //     (result: any) => {
    //       localStorage.setItem('ngx_code', null);
    //       this.initData();
    //     }, error => {
    //       console.error(error);
    //     }
    //   );
    // } else {
    //   this.initData();
    // }
    this.initData();

  }

  ngAfterViewInit(): void {
  }

  openApp() {
    const ua = navigator.userAgent;
    const isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1; // g
    const isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
    let timer = null;
    const bankInfo = {
      bank: '建设银行',
      scheme: 'ccbmobilebank',
      package: 'com.chinamworld.main',
      androidHostOrPath: 'main.ccb.com',
      androidScheme: 'ccbapp'
    };
    // android
    if (isAndroid) {
      // tslint:disable-next-line:max-line-length
      // window.location.href = `intent://#Intent;scheme=${scheme};package=${packageName};S.browser_fallback_url=//a.app.qq.com/o/simple.jsp?pkgname=${packageName};end`
      const t = 2000;
      let hasApp = true;
      const openScript = setTimeout(() => {
        if (!hasApp) {
          window.location.href = `//a.app.qq.com/o/simple.jsp?pkgname=${bankInfo.package}`;
        }
        document.body.removeChild(ifr);
      }, 3000);
      const t1 = Date.now();
      const ifr = document.createElement('iframe');
      ifr.setAttribute('src', `${bankInfo.androidScheme}://${bankInfo.androidHostOrPath}`);
      ifr.setAttribute('style', 'display:none');
      document.body.appendChild(ifr);
      timer = setTimeout(() => {
        const t2 = Date.now();
        if (t2 - t1 < t + 100) {
          hasApp = false;
        }
      }, t);
    } else { // ios
      window.location.href = `${bankInfo.scheme}://`;
      timer = setTimeout(() => {
        window.location.href = 'itms-apps://apps.apple.com/cn/app/id391965015';
      }, 3000);
    }
  }

  onChangeLanguage(lang) {
    if (this.lang === lang) {
      return;
    }
    this.lang = lang;
    localStorage.setItem('ngx_lang', lang);
    this.lang = localStorage.getItem('ngx_lang');
    this.translate.use(lang);
    this.translate.get('TITLE').subscribe((value => {
      this.appTitle.setTitle(value);
    }));
  }

  onHRConsulting() {
    window.location.href = environment.linkHRConsulting;
  }

  onDocuments(category?) {
    if (category) {
      this.router.navigate(['/app/documents'], {queryParams: {categoryId: category.id}});
    } else {
      this.router.navigate(['/app/documents']);
    }
  }

  onPDFDetail(document) {
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

  onShowLanguageChange() {
    (this.iosAS as ActionSheetComponent).show().subscribe((res: any) => {
      if (res.value === 'zh-CN') {
        this.onChangeLanguage('zh-CN');
      } else if (res.value === 'en') {
        this.onChangeLanguage('en');
      }
    });
  }

  private initData() {
    this.authService.getAccountInfo().subscribe(
      (result: any) => {
        const {code, data, message} = result;
        if (code === '1') {
          this.userInfo = data;
        }
      },
      error => {
        console.error(error);
      }
    );
    this.documentService.getDocumentByPageAndSize(1, 3).subscribe(
      (result: any) => {
        const {code, data, message} = result;
        if (code === '1') {
          this.recentDocuments = data.content;
        }
      }, error => {
        console.error(error);
      }
    );
    this.documentService.getDocumentCategory().subscribe(
      (result: any) => {
        const {code, data, message} = result;
        if (code === '1') {
          this.documentsCategory = data.content;
        }
      },
      error => {
        console.error(error);
      }
    );
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
        const {code, data, message} = result;
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
}
