import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {BaseComponent} from '../base.component';
import {ActivatedRoute} from '@angular/router';
import {ArticleService} from '../../services/article.service';
import {DomSanitizer, Meta, Title} from '@angular/platform-browser';
import {LocalStorage} from 'ngx-store';
import * as base64 from 'base-64';
import * as _ from 'lodash';
import {DialogComponent, DialogConfig, PopupComponent} from "ngx-weui";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ArticleDetailComponent extends BaseComponent implements OnInit {
  article;
  articleCommentList;
  articleId;
  articleImgList;
  moreLinks = ['软件开发的误区', '软件专业就业现状'];
  otherArticles =  ['工程师的那些事'];

  @LocalStorage()
  lang;

  @LocalStorage()
  userInfo;
  config: DialogConfig = {};

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private meta: Meta,
    private appTitle: Title,
    private domSanitizer: DomSanitizer,
  ) {
    super();
    console.info(this.userInfo);
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
          }
        },
        (error) => {
          console.error(error);
        }
      );
      // this.loadComments();
    });

  }

  like(){
    return false;
  }

}
