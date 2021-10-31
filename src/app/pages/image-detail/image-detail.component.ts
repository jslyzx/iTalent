import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {BaseComponent} from '../base.component';
import {ActivatedRoute} from '@angular/router';
import {DocumentService} from '../../services/document.service';
import {Meta} from '@angular/platform-browser';
import {DialogComponent, DialogConfig, PopupComponent} from "ngx-weui";
import {LocalStorage} from "ngx-store";
import * as _ from 'lodash';

@Component({
  selector: 'app-image-detail',
  templateUrl: './image-detail.component.html',
  styleUrls: ['./image-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ImageDetailComponent extends BaseComponent implements OnInit, OnDestroy {
  imageSrc = null;
  imageId;

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

  constructor(private route: ActivatedRoute, private documentService: DocumentService, private meta: Meta) {
    super();

  }


  ngOnInit(): void {
    this.meta.updateTag(
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0, user-scalable=yes'
      },
      `name='viewport'`
    );

    this.route.paramMap.subscribe(params => {
      this.imageId = params.get('imageId');
      this.documentService.getDocumentById(this.imageId).subscribe(
        (result: any) => {
          const {data, code, message} = result;
          if (code === '1') {
            this.likes = data.likes;
            this.clicks = data.clicks;
            this.isLike = data.isLike;
          }
        },
        (error) => {
          console.error(error);
        }
      );
      this.documentService.postDocumentRead(this.imageId).subscribe(
        (result: any) => {
          console.info(result);
        },
        (error: any) => {
          console.error(error);
        }
      )
      this.documentService.getDocumentBase64ByHash(this.imageId).subscribe(
        (result: any) => {
          const {code, data, message} = result;
          if (code === '1') {
            this.imageSrc = 'data:image/png;base64,' + data;
          }
        }, error => {
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
    this.documentService.postDocumentComment(this.imageId, {id, text}).subscribe(
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
    this.documentService.postDocumentLike(this.imageId).subscribe(
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
    this.meta.updateTag(
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no'
      },
      `name='viewport'`
    );
  }

  handleWaterMark(event) {
    const viewer: HTMLElement = document.getElementById('viewer');
    const childrenArray = Array.from(viewer.childNodes);
    const userInfo: any = localStorage.getItem('ngx_userInfo');
    childrenArray.forEach((item, index) => {
      if (item.childNodes[0].childNodes.length < 2) {
        const div = document.createElement('div');
        div.classList.add('watermark');
        for (let i = 0; i < 5; i++) {
          const p = document.createElement('p');
          // tslint:disable-next-line:max-line-length
          p.innerHTML = `${JSON.parse(userInfo).name} ${JSON.parse(userInfo).userid}&nbsp;${JSON.parse(userInfo).name}
          ${JSON.parse(userInfo).userid}&nbsp;${JSON.parse(userInfo).name} ${JSON.parse(userInfo).userid}&nbsp;
          ${JSON.parse(userInfo).name} ${JSON.parse(userInfo).userid}`;
          div.appendChild(p);
        }
        item.childNodes[0].appendChild(div);
      }
    });
  }

  private loadComments() {
    this.documentService.getDocumentCommentPublished(this.imageId).subscribe(
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
