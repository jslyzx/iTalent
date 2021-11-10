import {Component, OnInit, ViewChild} from '@angular/core';
import { BaseComponent } from '../base.component';
import {ActivatedRoute, Router} from "@angular/router";
import {SectionService} from "../../services/section.service";
import {DialogComponent, DialogConfig, DialogService, ToastComponent} from "ngx-weui";
import {environment} from '../../../environments/environment';
import { ToptipsComponent, ToptipsService, ToptipsType } from 'ngx-weui/toptips';
import { SkinType } from 'ngx-weui/core';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent extends BaseComponent implements OnInit {

  sectionId;

  list = [];

  staticPath = environment.staticApiPrefix;

  @ViewChild('success', { static: true }) successToast: ToastComponent;

  constructor(
    private sectionService: SectionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
    this.route.paramMap.subscribe(params => {
      this.sectionId = params.get('sectionId');
      this.initData();
    });
  }

  ngOnInit(): void {
  }

  private initData() {
    this.sectionService.getSectionFileList(this.sectionId).subscribe(
      (result: any) => {
        const {code, data, message} = result;
        if (code === 1) {
          this.list = data;
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  toPost(){
    this.router.navigate([`/app/post/${this.sectionId}`]);
  }

  toDetail(articleId){
    this.router.navigate([`/app/article/${articleId}`]);
  }

  notice(){
    this.sectionService.focus(parseInt(this.sectionId)).subscribe(
      (result: any) => {
        const {code, data, message} = result;
        if (code === 1) {
          this.successToast.onShow();
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

}
