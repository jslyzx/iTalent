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
import { MessageService } from '../../services/message.service';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CommentComponent extends BaseComponent implements OnInit, OnDestroy {

    content = '';

    articleId;

    commentId;

    isshow = false;

    @ViewChild('fileInput') fileInput: ElementRef;

    @ViewChild('toptips', { static: true }) toptips: ToptipsComponent;

    text = '';

    type: ToptipsType;

    hide;

    chace: false;

    accessToken = environment.accessToken;

    userList = [];

    remindUser = [];

    outUrl = '';

    chooseUser = false;

    searchText;

    emoji = [{id: 1, emoji: '😁'},{id: 2, emoji: '😂'},{id: 3, emoji: '😃'},{id: 4, emoji: '😄'},{id: 5, emoji: '👿'},{id: 6, emoji: '😉'},{id: 7, emoji: '😊'},{id: 8, emoji: '😌'},{id: 9, emoji: '😍'},{id: 10, emoji: '😏'},{id: 11, emoji: '😒'},{id: 12, emoji: '😓'},{id: 13, emoji: '😔'},{id: 14, emoji: '😖'},{id: 15, emoji: '😘'},{id: 16, emoji: '😚'},{id: 17, emoji: '😜'},{id: 18, emoji: '😝'},{id: 19, emoji: '😞'},{id: 20, emoji: '😠'},{id: 21, emoji: '😡'},{id: 22, emoji: '😢'},{id: 23, emoji: '😣'},{id: 24, emoji: '😥'},{id: 25, emoji: '😨'},{id: 26, emoji: '😪'},{id: 27, emoji: '😭'},{id: 28, emoji: '😰'},{id: 29, emoji: '😱'},{id: 30, emoji: '😲'},{id: 31, emoji: '😳'},{id: 32, emoji: '😷'},{id: 33, emoji: '🙃'},{id: 34, emoji: '😋'},{id: 35, emoji: '😗'},{id: 36, emoji: '😛'},{id: 37, emoji: '🤑'},{id: 38, emoji: '🤓'},{id: 39, emoji: '😎'},{id: 40, emoji: '🤗'},{id: 41, emoji: '🙄'},{id: 42, emoji: '🤔'},{id: 43, emoji: '😩'},{id: 44, emoji: '😤'},{id: 45, emoji: '🤐'},{id: 46, emoji: '🤒'}];

    constructor(private route: ActivatedRoute, private meta: Meta, private commentService: CommentService, private router: Router, private messageService: MessageService) {
        super();
        this.route.paramMap.subscribe(params => {
            this.articleId = parseInt(params.get('articleId'));
        });
        this.route.queryParams.subscribe(param => {
          this.commentId = param.commentId
        });
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    uploader: Uploader = new Uploader({
        url: 'http://117.144.170.42:5555/bbs/file/uploadImg',
        method: 'POST',
        headers: [{ name: 'Authorization', value: 'Bearer ' + this.accessToken }],
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
              commentId: this.commentId,
              commentInfo: this.content,
              articleCommentImgs: _.map(this.uploader.options.params.picList,function(v){return v.url}).join(),
              remindUser: _.map(this.remindUser, function(v) { return v.empNo }).join(),
              startTracking: this.chace ? 1 : 0
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

    mention() {
        this.chooseUser = true;
    }

    cancel(){
        history.go(-1);
    }

    addemoji(emoji){
      this.content = this.content + emoji
    }

    toggleEmoji(){
        this.isshow = !this.isshow;
    }

    onSearch(term: string) {
        this.searchText = term;
    }

    dealSearch(value: string) {
        this.messageService.getUserList(value).subscribe(
            (result: any) => {
                const { code, data, message } = result;
                if (code == 1) {
                    this.userList = data;
                }
            },
            error => {
                console.error(error);
            }
        );
    }

    onChooseUser(user){
        if(_.findIndex(this.remindUser, function(v){return v === user}) === -1){
            this.remindUser.push(user);
        }
        this.chooseUser = false;
    }

}