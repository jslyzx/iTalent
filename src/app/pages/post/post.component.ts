import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, Input, ElementRef} from '@angular/core';
import {BaseComponent} from '../base.component';
import {ActivatedRoute} from '@angular/router';
import {PostService} from '../../services/post.service';
import {Meta} from '@angular/platform-browser';
import {DialogComponent, DialogConfig, PopupComponent} from "ngx-weui";
import {LocalStorage} from "ngx-store";
import * as _ from 'lodash';
import { Uploader, UploaderOptions } from 'ngx-weui/uploader';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PostComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private route: ActivatedRoute, private meta: Meta) {
    super();

  }


  ngOnInit(): void {
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

  uploader: Uploader = new Uploader({
    url: 'http://117.144.170.42:5555/bbs/file/uploadImg',
    method: 'POST',
    auto: true,
    onFileQueued() {
      console.log('onFileQueued', arguments);
    },
    onFileDequeued() {
      console.log('onFileDequeued', arguments);
    },
    onStart() {
      console.log('onStart', arguments);
    },
    onCancel() {
      console.log('onCancel', arguments);
    },
    onFinished() {
      console.log('onFinished', arguments);
    },
    onUploadStart() {
      console.log('onUploadStart', arguments);
    },
    onUploadProgress() {
      console.log('onUploadProgress', arguments);
    },
    onUploadSuccess(file, response) {
      console.log('onUploadSuccess', arguments);
    },
    onUploadError() {
      console.log('onUploadError', arguments);
    },
    onUploadComplete() {
      console.log('onUploadComplete', arguments);
    },
    onUploadCancel() {
      console.log('onUploadCancel', arguments);
    },
    onError() {
      console.log('onError', arguments);
    },
  } as UploaderOptions);

  img: any;
  imgShow: boolean = false;

  onGallery(item: any) {
    this.img = [{ file: item._file, item }];
    this.imgShow = true;
  }

  onDel(item: any) {
    console.log(item);
    this.uploader.removeFromQueue(item.item);
  }

  triggerClick() {
    this.fileInput.nativeElement.click();
  }

  submit() {
    // this.uploader.uploadAll();
    debugger;
    console.log(this.uploader.queue);
  }

}
