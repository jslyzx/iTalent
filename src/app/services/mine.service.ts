import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MineService {

  // departmentId = environment.departmentId;

  constructor(
    private http: HttpClient,
  ) {
  }

  getPersonalInfo(){
    return this.http.get(`${environment.apiPrefix}/bbs/personalCenter/getInfo`).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

}
