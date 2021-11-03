import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  departmentId = environment.departmentId;

  constructor(
    private http: HttpClient,
  ) {
  }

  getDocumentByPageAndSize(page?, size?, search?) {
    if (!page) {
      page = 1;
    }
    if (!size) {
      size = 10;
    }
    if (!search) {
      search = {};
    }
    search.status = 1;
    search.departmentId = this.departmentId;
    return this.http.post(`${environment.apiPrefix}/document/search/${page}/${size}`, search).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

  getDocumentBase64ByHash(hash) {
    return this.http.get(`${environment.apiPrefix}/view/downloadBase64/${hash}`).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

  getDocumentCategoryTagByCategoryId(id, params) {
    return this.http.get(`${environment.apiPrefix}/bbs/bbsTag/ajaxList`).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

  getDocumentById(id) {
    return this.http.get(`${environment.apiPrefix}/document/${id}`).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

  postDocumentLike(docId) {
    return this.http.post(`${environment.apiPrefix}/document/${docId}/like`, {}).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

  getDocumentCommentAll(docId) {
    return this.http.get(`${environment.apiPrefix}/document/${docId}/comment/status/all`).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

  getDocumentCommentPublished(docId) {
    return this.http.get(`${environment.apiPrefix}/document/${docId}/comment/status/published`).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

  postDocumentRead(docId) {
    return this.http.post(`${environment.apiPrefix}/document/${docId}/read`, {}).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

  postDocumentComment(docId, payload) {
    return this.http.post(`${environment.apiPrefix}/document/${docId}/comment`, payload).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

  delDocumentComment(docId) {
    return this.http.delete(`${environment.apiPrefix}/document/comment/${docId}`, {}).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

  getDocumentCategory(page?, size?) {
    if (!page) {
      page = 1;
    }
    if (!size) {
      size = 10;
    }
    return this.http.post(`${environment.apiPrefix}/category/${this.departmentId}/${page}/${size}`, {status: 1}).pipe(
      map((result: any) => {
        return result;
      })
    );
  }

  getAllTags() {
    return this.http.get(`${environment.apiPrefix}/bbs/bbsTag/ajaxList`).pipe(
      map((result: any) => {
        return result;
      })
    );
  }

  getChannelByTag(tagId) {
    return this.http.get(`${environment.apiPrefix}/bbs/bbsSection/ajaxList`, {params:{tagId: tagId}}).pipe(
      map((result: any) => {
        return result;
      })
    );
  }

}
