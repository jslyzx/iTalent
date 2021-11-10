import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  // departmentId = environment.departmentId;

  constructor(
    private http: HttpClient,
  ) {
  }

  getSectionFileList(sectionId, moduleId) {
    return this.http.get(`${environment.apiPrefix}/bbs/article/ajaxList`, {params:{sectionId: sectionId, moduleId: moduleId}}).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

  focus(sectionId) {
    return this.http.post(`${environment.apiPrefix}/bbs/bbsSectionFocus/focus`, {sectionId: parseInt(sectionId)}).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

  unFocus(sectionId) {
    return this.http.post(`${environment.apiPrefix}/bbs/bbsSectionFocus/unFocus`, {sectionId: parseInt(sectionId)}).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

}
