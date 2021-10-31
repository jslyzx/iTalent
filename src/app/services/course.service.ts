import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private departmentId = environment.departmentId;

  constructor(
    private http: HttpClient,
  ) {

  }

  getCoursesByPageAndSize(page?, size?, search?) {
    if (!page) {
      page = 1;
    }
    if (!size) {
      size = 10;
    }
    if (!search) {
      search = {};
    }

    return this.http.post(`${environment.apiPrefix}/course/paging/${page}/${size}`, search).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

  applyCourseByCourseId(courseId, applyText) {
    return this.http.post(`${environment.apiPrefix}/course/${courseId}/apply`, {applyText: applyText}).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

  changeApplyCourseStatusByCourseId(applyCourseId, status, rejectText) {
    return this.http.post(`${environment.apiPrefix}/course/applyCourse/${applyCourseId}/status`, {
      status: status,
      rejectText: rejectText
    }).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

  getCourseById(courseId) {
    return this.http.get(`${environment.apiPrefix}/course/${courseId}`).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

  getApplicantsByCourseIdBySuperior(courseId) {
    return this.http.get(`${environment.apiPrefix}/course/${courseId}/applicants/bySuperior`).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

  getApplicantsByCourseId(courseId) {
    return this.http.get(`${environment.apiPrefix}/course/${courseId}/applicants`).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }
}
