import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  // departmentId = environment.departmentId;

  constructor(
    private http: HttpClient,
  ) {
  }

  postComment(payload) {
    return this.http.post(`${environment.apiPrefix}/bbs/article/save`, payload).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

}
