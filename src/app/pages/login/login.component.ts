import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {LocalStorage} from 'ngx-store';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @LocalStorage()
  code: string;

  @LocalStorage()
  authToken: any;

  @LocalStorage()
  firstAccessFlay: string;

  @LocalStorage()
  takeCode;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    if (!environment.production) {
      // tslint:disable-next-line:max-line-length
      this.authToken = environment.accessToken;
      this.code = 'xcjaQqTa7bhneVZ3Sp0xMVpq9C2e8jZCSRWpr1EVmS8';
      this.router.navigate(['/app/dashboard']);
      return;
    }
    // if (this.code) {
    //   this.authService.getAccessTokenByCode(this.code).subscribe(
    //     (result: any) => {
    //       this.router.navigate(['/app/dashboard']);
    //     }, error => {
    //       console.error(error);
    //     }
    //   );
    // } else {
    //   this.authService.handleLogin();
    // }
  }

}
