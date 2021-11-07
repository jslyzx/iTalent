import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  // departmentId = environment.departmentId;

  constructor(
    private http: HttpClient,
  ) {
  }

  getArticleDetail(articleId) {
    return this.http.get(`${environment.apiPrefix}/bbs/article/getById`, {params:{id: articleId}}).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

  getArticleListByType(type) {
    return this.http.get(`${environment.apiPrefix}/bbs/personalCenter/getArticleListByType`, {params:{type: type}}).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

}
