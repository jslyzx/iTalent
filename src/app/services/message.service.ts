import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  // departmentId = environment.departmentId;

  constructor(
    private http: HttpClient,
  ) {
  }

  getUserList(userName) {
    return this.http.get(`${environment.apiPrefix}/bbs/message/getUserList`, {params:{userName: userName}}).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

}
