import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {AuthService} from './auth.service';
import {EventBusService} from 'ngx-eventbus';
import {environment} from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
    private eventBus: EventBusService,
  ) {

  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization token for full api requests
    if (this.auth.authToken) {
      request = request.clone(
        {
          setHeaders: {
            Authorization: `Bearer ${this.auth.authToken}`,
          },
        });
    }
    if (!environment.production) {
      request = request.clone(
        {
          setHeaders: {
            // tslint:disable-next-line:max-line-length
            Authorization: `Bearer ${environment.accessToken}`,
          },
        });
    }
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const status = event.status;
          const {code, message} = event.body;
        }
        return event;
      }),
      catchError(
        (httpErrorResponse: HttpErrorResponse) => {
          const {status, error} = httpErrorResponse;
          const {message} = error;
          if (status === 401) {
            localStorage.setItem('ngx_code', null);
            localStorage.setItem('ngx_authToken', null);
            window.location.href = environment.accessCodeUrl;
          }
          return throwError(message);
        }),
    );
  }
}
