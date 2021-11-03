import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, Input, ElementRef } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from '../../services/comment.service';
import { Meta } from '@angular/platform-browser';
import { DialogComponent, DialogConfig, PopupComponent } from "ngx-weui";
import { LocalStorage } from "ngx-store";
import * as _ from 'lodash';
import { Uploader, UploaderOptions } from 'ngx-weui/uploader';
import { ToptipsComponent, ToptipsService, ToptipsType } from 'ngx-weui/toptips';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
})
export class CommentComponent extends BaseComponent implements OnInit, OnDestroy {

    public content: any;

    articleId;

    @ViewChild('fileInput') fileInput: ElementRef;

    @ViewChild('toptips', { static: true }) toptips: ToptipsComponent;

    text = '';

    type: ToptipsType;

    hide;

    constructor(private route: ActivatedRoute, private meta: Meta, private commentService: CommentService, private router: Router) {
        super();
        this.route.paramMap.subscribe(params => {
            this.articleId = params.get('articleId');
        });
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.meta.updateTag({
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
        params: {
            picList: []
        },
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
            this.params.picList.push({ id: file.id, url: JSON.parse(response).data });
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
        }
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
        _.remove(this.uploader.options.params.picList, function(v) { return v.id === item.item.id });
    }

    triggerClick() {
        this.fileInput.nativeElement.click();
    }

    submit() {
        console.log(this.uploader.queue);
        if (!this.uploader.isUploading) {
            if (!this.content) {
                this.text = '请输入内容！';
                this.type = 'warn';
                this.toptips.onShow();
                return false;
            }
            const self = this;
            this.commentService.postComment({
              articleId: this.articleId,
              commentInfo: this.content,
              articleCommentImgs: _.map(this.uploader.options.params.picList,function(v){return v.url}).join()
            }).subscribe(
                (result: any) => {
                    const { code, data, message } = result;
                    if (code === 1) {
                        self.text = '已提交';
                        self.type = 'success';
                        self.toptips.onShow();
                        self.router.navigate([`/app/article/${self.articleId}`]);
                    }
                },
                error => {
                    console.error(error);
                }
            );
        }
    }

    chooseMk() {
        // alert('选择模考');
    }

    mention() {

    }

    cancel(){
        history.go(-1);
    }

}