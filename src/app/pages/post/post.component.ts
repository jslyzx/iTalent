import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, Input, ElementRef } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { MessageService } from '../../services/message.service';
import { Meta } from '@angular/platform-browser';
import { DialogComponent, DialogConfig, PopupComponent } from "ngx-weui";
import { LocalStorage } from "ngx-store";
import * as _ from 'lodash';
import { ActionSheetComponent, ActionSheetConfig, ActionSheetMenuItem, ActionSheetService } from 'ngx-weui/actionsheet';
import { SkinType } from 'ngx-weui/core';
import { Uploader, UploaderOptions } from 'ngx-weui/uploader';
import { ToptipsComponent, ToptipsService, ToptipsType } from 'ngx-weui/toptips';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PostComponent extends BaseComponent implements OnInit, OnDestroy {

    public title: any;

    content = '';

    sectionId;

    isshow = false;

    @ViewChild('fileInput') fileInput: ElementRef;

    @ViewChild('fileInputCover') fileInputCover: ElementRef;

    @ViewChild('toptips', { static: true }) toptips: ToptipsComponent;

    @ViewChild('auto', { static: true }) autoAS: ActionSheetComponent;

    apiPath = environment.apiPrefix;

    accessToken = environment.accessToken;

    emoji = [{id: 1, emoji: '😁'},{id: 2, emoji: '😂'},{id: 3, emoji: '😃'},{id: 4, emoji: '😄'},{id: 5, emoji: '👿'},{id: 6, emoji: '😉'},{id: 7, emoji: '😊'},{id: 8, emoji: '😌'},{id: 9, emoji: '😍'},{id: 10, emoji: '😏'},{id: 11, emoji: '😒'},{id: 12, emoji: '😓'},{id: 13, emoji: '😔'},{id: 14, emoji: '😖'},{id: 15, emoji: '😘'},{id: 16, emoji: '😚'},{id: 17, emoji: '😜'},{id: 18, emoji: '😝'},{id: 19, emoji: '😞'},{id: 20, emoji: '😠'},{id: 21, emoji: '😡'},{id: 22, emoji: '😢'},{id: 23, emoji: '😣'},{id: 24, emoji: '😥'},{id: 25, emoji: '😨'},{id: 26, emoji: '😪'},{id: 27, emoji: '😭'},{id: 28, emoji: '😰'},{id: 29, emoji: '😱'},{id: 30, emoji: '😲'},{id: 31, emoji: '😳'},{id: 32, emoji: '😷'},{id: 33, emoji: '🙃'},{id: 34, emoji: '😋'},{id: 35, emoji: '😗'},{id: 36, emoji: '😛'},{id: 37, emoji: '🤑'},{id: 38, emoji: '🤓'},{id: 39, emoji: '😎'},{id: 40, emoji: '🤗'},{id: 41, emoji: '🙄'},{id: 42, emoji: '🤔'},{id: 43, emoji: '😩'},{id: 44, emoji: '😤'},{id: 45, emoji: '🤐'},{id: 46, emoji: '🤒'}];

    text = '';

    type: ToptipsType;

    hide;

    mkName = '';

    userList = [];

    remindUser = [];

    outUrl = '';

    menus: ActionSheetMenuItem[];

    config: ActionSheetConfig = {
        title: '选择模块'
    } as ActionSheetConfig;

    chooseUser = false;

    searchText;

    moduleList = [];

    moduleId;

    constructor(
        private route: ActivatedRoute, 
        private meta: Meta, 
        private postService: PostService, 
        private router: Router,
        private messageService: MessageService) 
    {
        super();
        this.route.paramMap.subscribe(params => {
            this.sectionId = params.get('sectionId');
        });
    }

    ngOnInit(): void {
        this.postService.getModuleList().subscribe(
            (result: any) => {
                const { code, data, message } = result;
                if (code == 1) {
                    this.menus = _.map(data,function(v){
                        return {
                            text: v.name,
                            value: v.id
                        }
                    })
                }
            },
            error => {
                console.error(error);
            }
        );
    }

    ngOnDestroy(): void {
        this.meta.updateTag({
                name: 'viewport',
                content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no'
            },
            `name='viewport'`
        );
    }

    uploader: Uploader = new Uploader({
        url: this.apiPath + '/bbs/file/uploadImg',
        headers: [{ name: 'Authorization', value: 'Bearer ' + this.accessToken }],
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

    uploaderCover: Uploader = new Uploader({
        url: this.apiPath + '/bbs/file/uploadImg',
        method: 'POST',
        headers: [{ name: 'Authorization', value: 'Bearer ' + this.accessToken }],
        auto: true,
        params: {
            picList: {}
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
            this.params.picList = { id: file.id, url: JSON.parse(response).data };
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

    onDelCover(item: any) {
        console.log(item);
        this.uploaderCover.removeFromQueue(item.item);
        this.uploader.options.params.picList = {};
    }

    triggerClick() {
        this.fileInput.nativeElement.click();
    }

    submit() {
        console.log(this.uploader.queue);
        if (!this.uploader.isUploading) {
            if (!this.title) {
                this.text = '请输入标题！';
                this.type = 'warn';
                this.hide = function() {
                    alert('fdf');
                }
                this.toptips.onShow();
                return false;
            }
            if (!this.content) {
                this.text = '请输入内容！';
                this.type = 'warn';
                this.toptips.onShow();
                return false;
            }
            const self = this;
            this.postService.postArticle({
                articleTitle: this.title,
                articleContent: this.content,
                articleImgs: _.map(this.uploader.options.params.picList, function(v) { return v.url }).join(),
                coverImg: this.uploaderCover.options.params.picList.url,
                sectionId: this.sectionId,
                outUrl: this.outUrl,
                remindUser: _.map(this.remindUser, function(v) { return v.empNo }).join(),
                moduleId: this.moduleId
            }).subscribe(
                (result: any) => {
                    const { code, data, message } = result;
                    if (code === 1) {
                        self.text = '已提交';
                        self.type = 'success';
                        self.toptips.onShow();
                        self.router.navigate([`/app/section/${self.sectionId}`]);
                    }
                },
                error => {
                    console.error(error);
                }
            );
        }
    }

    chooseMk(type: SkinType) {
        this.config.skin = type;
        this.config = { ...this.config };
        setTimeout(() => {
            ((this as any)[`${type}AS`] as ActionSheetComponent).show().subscribe((res: any) => {
                console.log('type', res);
                this.moduleId = res.value;
                this.mkName = res.text;
            });
        }, 10);
    }

    mention() {
        this.chooseUser = true;
    }

    cancel() {
        history.go(-1);
    }

    setCover() {
        this.fileInputCover.nativeElement.click();
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

    addemoji(emoji){
      this.content = this.content + emoji
    }

    toggleEmoji(){
        this.isshow = !this.isshow;
    }

}