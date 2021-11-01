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

  getSectionFileList(secionId) {
    return this.http.get(`${environment.apiPrefix}/bbs/article/ajaxList`, {params:{secionId: secionId}}).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

}
