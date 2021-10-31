import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {BaseComponent} from '../base.component';
import {ActivatedRoute} from '@angular/router';
import {PostService} from '../../services/post.service';
import {Meta} from '@angular/platform-browser';
import {DialogComponent, DialogConfig, PopupComponent} from "ngx-weui";
import {LocalStorage} from "ngx-store";
import * as _ from 'lodash';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PostComponent extends BaseComponent implements OnInit, OnDestroy {


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

}
