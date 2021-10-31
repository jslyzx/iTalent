import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CourseService} from "../../services/course.service";
import {DialogComponent, DialogConfig, DialogService, ToastComponent} from "ngx-weui";

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {
  @ViewChild('success', {static: true}) successToast: ToastComponent;
  @ViewChild('failed', {static: true}) failedToast: ToastComponent;
  @ViewChild('ios', {static: true}) iosAS: DialogComponent;

  courseId;
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
      this.courseId = params.get('courseId');
      this.initData();
    });
  }

  ngOnInit(): void {
  }

  onApply(applyText) {
    this.courseService.applyCourseByCourseId(this.courseId, applyText).subscribe(
      (result: any) => {
        const {code, data, message} = result;
        if (code === '1') {
          this.initData();
          this.successToast.onShow();
        } else {
          this.failedToast.onShow();
        }
      },
      (error: any) => {
        this.failedToast.onShow();
      }
    )
  }

  onDetail(applicant) {
    this.applicant = applicant;
    this.config = {
      skin: 'ios',
      cancel: '通过/Approve',
      confirm: '拒绝/Reject',
      cancelType: 'primary',
      confirmType: 'default',
      type: 'prompt',
      input: 'textarea',
      inputPlaceholder: '如拒绝：请写明理由/Reject reason;' +
        '如通过：请与员工沟通培训期望/ Share your expectation to participants after approval',
      inputError: '请填写拒绝理由/Reject reason is required',
      inputRequired: true,
      inputAttributes: {
        maxlength: 200,
        cn: 1,
      },
      backdrop: true,
      content: `${this.applicant.totalName}报名该课程<p>申请理由/Application Reason:${this.applicant.applyText}</p>`,
    }
    this.iosAS.show().subscribe((res: any) => {
      const status = !res.value ? 'APPROVE' : 'REJECT';
      this.courseService.changeApplyCourseStatusByCourseId(applicant.id, status, res.result).subscribe(
        (result: any) => {
          const {code, data, message} = result;
          if (code === '1') {
            this.initData();
          }
        },
        (error: any) => {
          console.log(error);
        }
      )
    });
  }

  onProgramDetail(course) {
    window.location.href = course.content;
  }

  onApplyConfirm() {
    console.log(this.course);
    if (this.course.id === 4) {
      this.config = {
        skin: 'ios',
        type: 'prompt',
        input: 'textarea',
        cancel: '取消/Cancel',
        confirm: '确认/Confirm',
        cancelType: 'default',
        confirmType: 'primary',
        inputPlaceholder: 'Please describe your development needs based on PMGM goals and why this program is necessary for you.\n' +
          '请描述您的发展需求，包含绩效目标的挑战及参加项目的必要性。',
        inputError: '请填写报名理由/Reason is required',
        inputRequired: true,
        inputAttributes: {
          maxlength: 300,
          cn: 1,
        },
        backdrop: true,
        content: `
            <p>我两年内未参加过项目管理发展项目</p>
            <p>I haven’t participated project management programs in the past 2 years.</p>
            <p>我的岗位级别是14级或以下</p>
            <p>My position grade is 14 or below</p>
      `,
      }
    }
    if (this.course.id === 5) {
      this.config = {
        skin: 'ios',
        type: 'prompt',
        input: 'textarea',
        cancel: '取消/Cancel',
        confirm: '确认/Confirm',
        cancelType: 'default',
        confirmType: 'primary',
        inputPlaceholder: 'Please describe your development needs based on PMGM goals and why this program is necessary for you.' +
          '请描述您的发展需求，包含绩效目标的挑战及参加项目的必要性。',
        inputError: '请填写报名理由/Reason is required',
        inputRequired: true,
        inputAttributes: {
          maxlength: 300,
          cn: 1,
        },
        backdrop: true,
        content: `
            <p>我2年内未参加过项目管理发展项目</p>
            <p>I haven't participated project management programs in the past 2 years.</p>
            <p>我的岗位级别是F7或F6 </p>
            <p>My position grade is F7 or F6</p>
      `,
      }
    }
    this.iosAS.show().subscribe((res: any) => {
      if (res.value) {
        this.onApply(res.result);
      }

    });
  }

  generateStatus(status) {
    if (status === 'APPROVE') {
      return 'Approved'
    }
    if (status === 'REJECT') {
      return 'Rejected'
    }
  }

  private initData() {
    this.courseService.getCourseById(this.courseId).subscribe(
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
    this.courseService.getApplicantsByCourseIdBySuperior(this.courseId).subscribe(
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
