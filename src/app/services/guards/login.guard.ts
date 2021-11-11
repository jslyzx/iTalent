import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {LocalStorage} from 'ngx-store';
import utils from '../../utils/utils';
import {AuthService} from "../auth.service";
import {Observable, of} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  @LocalStorage()
  code: string;
  @LocalStorage()
  from: string;
  @LocalStorage()
  preUrl: string;
  @LocalStorage()
  authToken: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // return true;
    // if (this.authService.authToken) {
    //   return true;
    // }
    // // Navigate to the login page with extras
    // // this.router.navigate(['/pages/login']);
    // window.location.href = environment.loginUrl;
    // return false;
    const currentUrl = window.location.href;
    const currentUrlVars: any = utils.getUrlVars(currentUrl);
    if (currentUrlVars && currentUrlVars.code) {
      this.from = currentUrlVars.from;
      return this.authService.getAccessTokenByCode(currentUrlVars.code).pipe(
        map((result: any) => {
          // tslint:disable-next-line:no-shadowed-variable
          const {data, code, message} = result;
          switch (code) {
            case '1':
              localStorage.setItem('ngx_authToken', data.access_token);
              this.authToken = data.access_token;
              if (this.preUrl) {
                window.location.href = this.preUrl;
                this.preUrl = null;
              }
              return true;
            // break;
            default:
              this.router.navigate(['/app/dashboard']);
              return false;
            // break;
          }
        }),
      );
    } else {
      return of(true)
    }
  }

}
