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

declare var tinyMCE: any;

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
        var con = tinyMCE.activeEditor.getContent();
        alert(con);
        return false;
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
            if (!con) {
                this.text = '请输入内容！';
                this.type = 'warn';
                this.toptips.onShow();
                return false;
            }
            const self = this;
            this.postService.postArticle({
                articleTitle: this.title,
                articleContent: con,
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

}