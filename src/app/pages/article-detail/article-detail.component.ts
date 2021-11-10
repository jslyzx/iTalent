import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {BaseComponent} from '../base.component';
import {ActivatedRoute, Router} from '@angular/router';
import {ArticleService} from '../../services/article.service';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';
import {LocalStorage} from 'ngx-store';
import * as base64 from 'base-64';
import * as _ from 'lodash';
import {DialogComponent, DialogConfig, PopupComponent} from "ngx-weui";
import {TranslateService} from "@ngx-translate/core";
import {environment} from '../../../environments/environment';
import {EventBusService} from 'ngx-eventbus';
import {WXService} from '../../services/wx.service';

declare var wx: any;

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArticleDetailComponent extends BaseComponent implements OnInit {
  article;
  articleCommentList;
  articleId;
  articleImgList;
  articleCollectNum = 0;
  articleCommentNum = 0;
  articleLikeNum = 0;
  articleForwardNum = 0;
  moreLinks = ['软件开发的误区', '软件专业就业现状'];
  otherArticles =  ['工程师的那些事'];

  isCollect = false;
  isForward = false;
  isLike = false;

  @LocalStorage()
  lang;

  @LocalStorage()
  userInfo;
  config: DialogConfig = {};

  staticPath = environment.staticApiPrefix;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
    private meta: Meta,
    private appTitle: Title,
    private domSanitizer: DomSanitizer,
    private eventBusService: EventBusService,
    private wxService: WXService
  ) {
    super();
    console.info(this.userInfo);
    this.wxService.config({});
  }


  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.articleId = params.get('articleId');
      // 已读
      // this.documentService.postDocumentRead(this.docId).subscribe(
      //   (result: any) => {
      //   },
      //   (error: any) => {
      //     console.error(error);
      //   }
      // )
      this.articleService.getArticleDetail(this.articleId).subscribe(
        (result: any) => {
          const {data, code, message} = result;
          if (code === 1) {
            this.article = data.article;
            this.articleCommentList = data.articleCommentList;
            this.articleImgList = data.articleImgList;
            this.articleLikeNum = data.articleLikeNum;
            this.articleCollectNum = data.articleCollectNum;
            this.articleCommentNum = data.articleCommentNum;
            this.articleForwardNum = data.articleForwardNum;
            this.isCollect = data.isCollect;
            this.isForward = data.isForward;
            this.isLike = data.isLike;
          }
        },
        (error) => {
          console.error(error);
        }
      );
      // this.loadComments();
    });

  }

  comment(){
    this.router.navigate([`/app/comment/${this.articleId}`]);
  }

  commentCom(id){
    this.router.navigate([`/app/comment/${this.articleId}`], { queryParams: { commentId: id } });
  }

  toggleCollect(articleId){
    if(this.isCollect){
      this.articleService.cancelOperate(articleId, 1).subscribe(
        (result: any) => {
          const {data, code, message} = result;
          if (code === 1) {
            this.isCollect = false;
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }else{
      this.articleService.operateArticle(articleId, 1).subscribe(
        (result: any) => {
          const {data, code, message} = result;
          if (code === 1) {
            this.isCollect = true;
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  toggleForward(articleId){
    wx.ready(() => {
      wx.onMenuShareTimeline({
        title: this.article.articleTitle,
        link: window.location.href,
        imgUrl: '',
        success: function(){
          this.articleService.operateArticle(articleId, 2).subscribe(
            (result: any) => {
              const {data, code, message} = result;
              if (code === 1) {
                this.isForward = true;
              }
            },
            (error) => {
              console.error(error);
            }
          );
        }
      });
    });
    
  }

  toggleLike(articleId){
    if(this.isLike){
      this.articleService.cancelOperate(articleId, 3).subscribe(
        (result: any) => {
          const {data, code, message} = result;
          if (code === 1) {
            this.isLike = false;
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }else{
      this.articleService.operateArticle(articleId, 3).subscribe(
        (result: any) => {
          const {data, code, message} = result;
          if (code === 1) {
            this.isLike = true;
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

}
