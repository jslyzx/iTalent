import {Component, OnInit, ViewChild} from '@angular/core';
import { BaseComponent } from '../base.component';
import {ActivatedRoute, Router} from "@angular/router";
import {SectionService} from "../../services/section.service";
import { PostService } from '../../services/post.service';
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

  moduleId;

  menus = [];

  isZd = true;

  isSs = false;

  @ViewChild('success', { static: true }) successToast: ToastComponent;

  constructor(
    private sectionService: SectionService,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
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
    this.postService.getModuleList().subscribe(
          (result: any) => {
              const { code, data, message } = result;
              if (code == 1) {
                  this.menus = data;
              }
          },
          error => {
              console.error(error);
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

  changeTab(id){
    if(this.moduleId == id){
      return false;
    }
    this.moduleId = id;
    this.isZd = false;
    this.isSs = false;
    this._dealSearch();
  }

  changeZd(){
    if(this.isZd){
      return false;
    }
    this.moduleId = '';
    this.isZd = true;
    this.isSs = false;
    this._dealSearch();
  }

  changeSs(){
    if(this.isSs){
      return false;
    }
    this.moduleId = '';
    this.isSs = true;
    this.isZd = false;
    this._dealSearch();
  }

  _dealSearch(){
    this.sectionService.getSectionFileList(this.sectionId, this.moduleId).subscribe(
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

}
