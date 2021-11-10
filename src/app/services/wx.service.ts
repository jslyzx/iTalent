import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JWeiXinService} from './jweixin';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';
import {EVENT_TOAST_ERROR} from '../utils/utils';
import {EventBusService} from 'ngx-eventbus';

declare var wx: any;

@Injectable({
  providedIn: 'root'
})
export class WXService {
  private share: any;

  constructor(
    private wxService: JWeiXinService,
    private eventBusService: EventBusService,
    private auth: AuthService,
    private http: HttpClient
  ) {
  }

  config(shareData: any): Promise<boolean> {
    this.share = shareData;
    return new Promise((resolve, reject) => {
      wx.error(() => {
        reject('config 注册失败');
      });
      const currentUrl = location.href.split('#')[0];
      // alert(currentUrl);
      this.http
        .post(`${environment.authApiPrefix}/webChat/${environment.appName}/js/signature?signUrl=${currentUrl}`, {})
        .pipe(
          catchError(() => {
            reject('无法获取签名数据');
            this.eventBusService.triggerEvent(EVENT_TOAST_ERROR, {
              errorMsg: '无法获取签名数据',
            });
            return throwError('error');
          }),
        )
        .subscribe((ret: any) => {
          if (!ret) {
            this.eventBusService.triggerEvent(EVENT_TOAST_ERROR, {
              errorMsg: 'jsapi 获取失败',
            });
            reject('jsapi 获取失败');
            return;
          }
          // jsApiList: ['onHistoryBack']
          ret.jsApiList = ['hideAllNonBaseMenuItem', 'onMenuShareTimeline'];
          ret.appId = ret.appid;
          // ret.beta = true;
          // ret.debug = true;
          wx.config(ret);
          // this.eventBusService.triggerEvent(EVENT_TOAST_ASYNC_LOADING);
        });
    });
  }
}
