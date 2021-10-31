import {Component, OnInit, ViewChild} from '@angular/core';
import {CourseService} from "../../services/course.service";
import {InfiniteLoaderComponent} from "ngx-weui";
import {Observable, timer} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  @ViewChild(InfiniteLoaderComponent, {static: true}) il: InfiniteLoaderComponent;

  items: any[];
  item: Observable<string[]>;
  page = 1;
  totalPages = 1;
  size = 20;
  search = {};

  constructor(
    private courseService: CourseService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  onCourseDetail(course) {
    this.router.navigate(['/app/course/' + course.id]);
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    this.courseService.getCoursesByPageAndSize(this.page, this.size, this.search).subscribe(
      (result: any) => {
        const {code, data, message} = result;
        if (code === '1') {
          this.items.push(data.content);
          this.totalPages = data.content && data.content.totalPages;
        }
        if (this.items.length >= this.totalPages) {
          comp.setFinished();
          return;
        }
        comp.resolveLoading();
      },
      (error: any) => {
        comp.resolveLoading();
      }
    )
    // timer(1500).subscribe(() => {
    //   this.items.push(
    //     ...Array(20)
    //       .fill(this.items.length)
    //       .map((v, i) => v + i),
    //   );
    //
    //   if (this.items.length >= 50) {
    //     comp.setFinished();
    //     return;
    //   }
    //   comp.resolveLoading();
    // });
  }

  restart() {
    this.items.length = 0;
    this.il.restart();
  }

  onSearch(term: string) {
    // console.log(term);
    // if (term) this.item = this.tbService.search(term);
    this.search['title'] = term;
    this.loadCourses();
  }

  onCancel() {
    // console.log('onCancel');
    this.loadCourses();
  }

  onClear() {
    // console.log('onCancel');
    this.loadCourses();
  }

  onSubmit(value: string) {
    // console.log('onSubmit', value);
    // this.search['title'] = value;
    // this.loadCourses();
  }

  private loadCourses() {
    this.courseService.getCoursesByPageAndSize(this.page, this.size, this.search).subscribe(
      (result: any) => {
        const {code, data, message} = result;
        if (code === '1') {
          this.items = data.content;
          this.totalPages = data.content && data.content.totalPages;
        }
      },
      (error: any) => {
        console.log(error);
      }
    )
  }
}
