import {Component, OnInit, ViewChild} from '@angular/core';
import { BaseComponent } from '../base.component';
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleService} from "../../services/article.service";
import {environment} from '../../../environments/environment';
import {DialogComponent, DialogConfig, DialogService, ToastComponent} from "ngx-weui";

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent extends BaseComponent implements OnInit {

  type;

  list = [];

  staticPath = environment.staticApiPrefix;

  constructor(
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
    this.route.paramMap.subscribe(params => {
      this.type = params.get('type');
      this.initData();
    });
  }

  ngOnInit(): void {
  }

  private initData() {
    this.articleService.getArticleListByType(this.type).subscribe(
      (result: any) => {
        const {code, data, message} = result;
        if (code === 1) {
          this.list = data;
        }
      },
      (error: any) => {
        console.log(error);
      }
    )
  }

  toDetail(articleId){
    this.router.navigate([`/app/article/${articleId}`]);
  }

}
