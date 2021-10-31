import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-page',
  template: `
    <div class="page__hd" *ngIf="showHeader">
      <h1 class="page__title" [innerHTML]="title"></h1>
      <p class="page__desc" [innerHTML]="subTitle"></p>
    </div>
    <div class="page__bd" [ngClass]="{ page__bd_spacing: spacing }">
      <ng-content></ng-content>
    </div>
    <div class="page__ft" [ngClass]="{ j_bottom: ftBottom }" *ngIf="!noBottom">
      <p class="weui-footer__text">Copyright © 2020-{{ year }} Powered by IT & Digitalization GC</p>
      <ng-content select="[footer]"></ng-content>
    </div>
  `,
  // tslint:disable-next-line:no-host-metadata-property
  host: {
    class: 'page',
  },
  styleUrls: ['./page.component.scss'],
})
export class PageComponent {
  @Input() title: string;
  @Input() subTitle: string;
  @Input() spacing = true;
  @Input() showHeader = false;
  @Input() ftBottom = false;
  @Input() noBottom = false;
  year: number = new Date().getFullYear();

  constructor() {
  }
}
