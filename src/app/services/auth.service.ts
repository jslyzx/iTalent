import {Injectable} from '@angular/core';
import {LocalStorage} from 'ngx-store';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {EVENT_AUTH_ERROR} from '../utils/utils';
import {EventBusService} from 'ngx-eventbus';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @LocalStorage()
  authToken: any;
  @LocalStorage()
  code: string;
  @LocalStorage()
  preUrl: string;
  @LocalStorage()
  from: string;

  constructor(
    private http: HttpClient,
    private eventBus: EventBusService,
    private router: Router,
  ) {
    this.eventBus.addEventListener(
      {
        name: EVENT_AUTH_ERROR,
        callback: (payload: any) => {
          if (payload.event === 'login') {
            this.handleLogin();
          }
        },
      });
  }

  storeCode(code: string) {
    this.code = code;
  }


  handleLogin() {
    localStorage.setItem('ngx_code', null);
    localStorage.setItem('ngx_authToken', null);
    window.location.href = environment.accessCodeUrl;
  }

  createFeedback(params) {
    return this.http.post(`${environment.authApiPrefix}/feedback/${environment.appName}`, params).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

  getAccessTokenByCode(code: string) {
    return this.http.get(`${environment.authApiPrefix}/account/${environment.appName}/getToken/${code}`);
  }

  // getAccessTokenByCode(code: string) {
  //   return this.http.get(`${environment.authApiPrefix}/account/${environment.appName}/getToken/${code}`).pipe(
  //     map((result: any) => {
  //       // tslint:disable-next-line:no-shadowed-variable
  //       const {data, code, message} = result;
  //       switch (code) {
  //         case '1':
  //           localStorage.setItem('ngx_authToken', data.access_token);
  //           this.authToken = data.access_token;
  //           if (this.preUrl) {
  //             window.location.href = this.preUrl;
  //             this.preUrl = null;
  //           }
  //           break;
  //         case '1012':
  //           this.handleLogin();
  //           break;
  //         default:
  //           break;
  //       }
  //       return result;
  //     }),
  //   );
  // }

  getAccountInfo() {
    return this.http.get(`${environment.authApiPrefix}/account/${environment.appName}/info`).pipe(
      map((result: any) => {
        // tslint:disable-next-line:no-shadowed-variable
        return result;
      }),
    );
  }
}
