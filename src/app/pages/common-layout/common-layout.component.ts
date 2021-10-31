import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ToastComponent, ToastService, ToptipsComponent, ToptipsType} from 'ngx-weui';
import {EventBusService} from 'ngx-eventbus';
import {
  EVENT_SHOW_TOPTIPS,
  EVENT_TOAST_ASYNC_LOADING,
  EVENT_TOAST_ERROR,
  EVENT_TOAST_LOADING,
  EVENT_TOAST_SUCCESS
} from '../../utils/utils';
import {Router} from '@angular/router';


@Component({
  selector: 'app-common-layout',
  styleUrls: ['./common-layout.component.scss'],
  templateUrl: './common-layout.component.html',
})
export class CommonLayoutComponent implements OnInit, AfterViewInit {
  @ViewChild('toptips', {static: true}) toptips: ToptipsComponent;
  @ViewChild('success', {static: true}) successToast: ToastComponent;
  @ViewChild('loading', {static: true}) loadingToast: ToastComponent;
  @ViewChild('asyncLoading', {static: true}) asyncLoading: ToastComponent;
  @ViewChild('error', {static: true}) errorToast: ToastComponent;
  errorMsg = null;

  text = '';
  type: ToptipsType;

  constructor(
    private toastService: ToastService,
    private eventBus: EventBusService,
    private router: Router,
  ) {
    this.eventBus.addEventListener(
      {
        name: EVENT_TOAST_LOADING,
        callback: (payload: any) => {
          this.loadingToast.onShow();
        },
      });

    this.eventBus.addEventListener(
      {
        name: EVENT_TOAST_ASYNC_LOADING,
        callback: (payload: any) => {
          this.asyncLoading.onShow();
        },
      });

    this.eventBus.addEventListener(
      {
        name: EVENT_TOAST_SUCCESS,
        callback: (payload: any) => {
          this.successToast.onShow();
        },
      });

    this.eventBus.addEventListener(
      {
        name: EVENT_TOAST_ERROR,
        callback: (payload: any) => {
          this.errorMsg = payload.errorMsg;
          this.errorToast.onShow();
        },
      });

    this.eventBus.addEventListener(
      {
        name: EVENT_SHOW_TOPTIPS,
        callback: (payload: any) => {
          this.onShow(payload.text, payload.type);
        },
      });
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
  }

  private onShow(text: string, type: ToptipsType) {
    this.type = type;
    this.text = text;
    this.toptips.onShow();
  }
}
