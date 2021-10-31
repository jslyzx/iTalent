import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import {AuthService} from '../auth.service';
import {LocalStorage} from 'ngx-store';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  @LocalStorage()
  code: string;
  @LocalStorage()
  preUrl: string;

  constructor(
    private authService: AuthService,
    private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.preUrl = window.location.href;
    return true;
  }

}
