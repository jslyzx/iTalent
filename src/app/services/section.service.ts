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

  getSectionFileList(sectionId) {
    return this.http.get(`${environment.apiPrefix}/bbs/article/ajaxList`, {params:{sectionId: sectionId}}).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

}
