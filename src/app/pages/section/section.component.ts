import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SectionService} from "../../services/section.service";
import {DialogComponent, DialogConfig, DialogService, ToastComponent} from "ngx-weui";

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class CourseDetailComponent implements OnInit {
  @ViewChild('success', {static: true}) successToast: ToastComponent;
  @ViewChild('failed', {static: true}) failedToast: ToastComponent;
  @ViewChild('ios', {static: true}) iosAS: DialogComponent;

  sectionId;
  applicant: any;
  course: any = {};
  applicantsBySuperior = [];
  toastMessage = '';
  config: DialogConfig = {};

  constructor(
    private courseService: CourseService,
    private srv: DialogService,
    private route: ActivatedRoute,
  ) {
    this.route.paramMap.subscribe(params => {
      this.sectionId = params.get('sectionId');
      this.initData();
    });
  }

  ngOnInit(): void {
  }

  private initData() {
    this.courseService.getCourseById(this.sectionId).subscribe(
      (result: any) => {
        const {code, data, message} = result;
        if (code === '1') {
          this.course = data;
        }
      },
      (error: any) => {
        console.log(error);
      }
    )
    this.courseService.getApplicantsByCourseIdBySuperior(this.sectionId).subscribe(
      (result: any) => {
        const {code, data, message} = result;
        if (code === '1') {
          this.applicantsBySuperior = data ? data : [];
        }
      },
      (error: any) => {
        console.log(error);
      }
    )
  }

}
