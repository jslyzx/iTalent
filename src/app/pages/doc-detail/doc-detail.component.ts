import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {BaseComponent} from '../base.component';
import {ActivatedRoute} from '@angular/router';
import {DocumentService} from '../../services/document.service';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';
import {LocalStorage} from 'ngx-store';
import * as base64 from 'base-64';
import * as _ from 'lodash';
import {DialogComponent, DialogConfig, PopupComponent} from "ngx-weui";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-doc-detail',
  templateUrl: './doc-detail.component.html',
  styleUrls: ['./doc-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocDetailComponent extends BaseComponent implements OnInit, OnDestroy {
  docSrc = null;
  docId;
  likes;
  clicks;
  isLike;
  comments = [];
  tmpCommentId = 0;
  tmpCommentText;
  @ViewChild('comment', {static: true}) simplePopup: PopupComponent;
  @ViewChild('auto', {static: true}) autoAS: DialogComponent;

  @LocalStorage()
  lang;

  @LocalStorage()
  userInfo;
  config: DialogConfig = {};

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private meta: Meta,
    private appTitle: Title,
    private domSanitizer: DomSanitizer,
  ) {
    super();
    console.info(this.userInfo);
  }


  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.docId = params.get('docId');
      this.documentService.postDocumentRead(this.docId).subscribe(
        (result: any) => {
        },
        (error: any) => {
          console.error(error);
        }
      )
      this.documentService.getDocumentById(this.docId).subscribe(
        (result: any) => {
          const {data, code, message} = result;
          if (code === '1') {
            this.appTitle.setTitle(this.lang === 'en' ? data.fileNameEn : data.fileNameCn);
            this.likes = data.likes;
            this.clicks = data.clicks;
            this.isLike = data.isLike;
            if (this.lang === 'en') {
              this.docSrc = this.domSanitizer.bypassSecurityTrustHtml(decodeURIComponent(base64.decode(data.contentEn)));
            } else {
              this.docSrc = this.domSanitizer.bypassSecurityTrustHtml(decodeURIComponent(base64.decode(data.content)));
            }
          }
        },
        (error) => {
          console.error(error);
        }
      );
      this.loadComments();
    });

  }

  onConfirmDelDialog(comment: any) {
    this.config = {
      skin: 'auto',
      cancel: '取消',
      confirm: '确认',
      content: '是否删除当前评论？',
    }

    setTimeout(() => {
      ((this as any)[`autoAS`] as DialogComponent).show().subscribe((res: any) => {
        console.log('type', res);
        if (res.value) {
          this.onDeleteComment(comment);
        }
      });
    }, 10);
    return false;
  }

  handleCommentConfirm(commentId?: any) {
    this.handleComment(this.tmpCommentId, this.tmpCommentText);
  }

  handleComment(id, text) {
    if (_.isEmpty(text)) {
      return;
    }
    this.documentService.postDocumentComment(this.docId, {id, text}).subscribe(
      (result: any) => {
        const {data, code, message} = result;
        if (code === '1') {
          this.tmpCommentId = 0;
          this.tmpCommentText = null;
          this.loadComments();
        }
      },
      (error) => {
        console.error(error);
      })
  }

  onDeleteComment(comment: any) {
    this.documentService.delDocumentComment(comment.id).subscribe(
      (result: any) => {
        const {data, code, message} = result;
        if (code === '1') {
          this.loadComments();
        }
      },
      (error) => {
        console.error(error);
      })
  }

  handleLike() {
    this.documentService.postDocumentLike(this.docId).subscribe(
      (result: any) => {
        const {data, code, message} = result;
        if (code === '1') {
          this.likes = data.likes;
          this.isLike = data.isLike;
        }
      },
      (error) => {
        console.error(error);
      })
  }

  ngOnDestroy(): void {
    this.translate.get('TITLE').subscribe((value => {
      this.appTitle.setTitle(value);
    }));
  }

  handleWaterMark(event) {
    const viewer: HTMLElement = document.getElementById('viewer');
    const childrenArray = Array.from(viewer.childNodes);
    const userInfo: any = localStorage.getItem('ngx_userInfo');
    childrenArray.forEach((item, index) => {
      if (item.childNodes[0].childNodes.length < 2) {
        const div = document.createElement('div');
        div.classList.add('watermark');
        for (let i = 0; i < 10; i++) {
          const p = document.createElement('p');
          // tslint:disable-next-line:max-line-length
          p.innerHTML = `${JSON.parse(userInfo).name} ${JSON.parse(userInfo).userid}&nbsp;${JSON.parse(userInfo).name} ${JSON.parse(userInfo).userid}&nbsp;${JSON.parse(userInfo).name} ${JSON.parse(userInfo).userid}&nbsp;${JSON.parse(userInfo).name} ${JSON.parse(userInfo).userid}`;
          div.appendChild(p);
        }
        item.childNodes[0].appendChild(div);
      }
    });
  }

  private loadComments() {
    this.documentService.getDocumentCommentPublished(this.docId).subscribe(
      (result: any) => {
        const {data, code, message} = result;
        if (code === '1') {
          this.comments = data;
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
