import {Component} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
  RoutesRecognized
} from '@angular/router';
import {LocalStorage} from 'ngx-store';
import {TranslateService} from '@ngx-translate/core';
import {WXService} from './services/wx.service';

declare var navigator: any;
declare var wx: any;
declare var tinyMCE: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @LocalStorage()
  firstAccessFlay: string;

  @LocalStorage()
  lang;

  title = '人事发布';

  constructor(
    private translate: TranslateService,
    private wxService: WXService,
    private appTitle: Title,
    private router: Router
  ) {
    translate.addLangs(['zh-CN', 'en']);
    translate.setDefaultLang('zh-CN');
    this.setLanguage();

    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Navigation started.
        // console.log(event.url);
      } else if (event instanceof RoutesRecognized) {
        // Router parses the URL and the routes are recognized.
      } else if (event instanceof RouteConfigLoadStart) {
        // Before the Router lazyloads a route configuration.
      } else if (event instanceof RouteConfigLoadEnd) {
        // Route has been lazy loaded.
      } else if (event instanceof NavigationEnd) {
        // Navigation Ended Successfully.
        // console.log(event.url);
      } else if (event instanceof NavigationCancel) {
        // Navigation is canceled as the Route-Guard returned false during navigation.
      } else if (event instanceof NavigationError) {
        // Navigation fails due to an unexpected error.
        // console.log(event.error);
      }
    });
  }

  private setLanguage() {
    // this.wxService.config({});
    // wx.ready(() => {
    //   console.log('wx ready');
    // });
    if (this.lang) {
      this.translate.use(this.lang);
    } else {
      this.translate.use('zh-CN');
    }
    this.translate.get('TITLE').subscribe(value => {
      this.title = value;
      this.appTitle.setTitle(this.title);
    });
  }
}

