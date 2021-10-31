import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  // departmentId = environment.departmentId;

  constructor(
    private http: HttpClient,
  ) {
  }

}
