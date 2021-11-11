import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ButtonModule, InfiniteLoaderModule, SearchBarModule, ToastModule, WeUiModule} from 'ngx-weui';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {CommonLayoutComponent} from './pages/common-layout/common-layout.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {AuthInterceptor} from './services/auth.interceptor';
import {FormsModule} from '@angular/forms';
import {MatSliderModule} from '@angular/material/slider';
import {DocumentsComponent} from './pages/documents/documents.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MatTabsModule} from '@angular/material/tabs';
import * as Hammer from 'hammerjs';
import { MessageComponent } from './pages/message/message.component';
import { PostComponent } from './pages/post/post.component';
import { SectionComponent } from './pages/section/section.component';
import { CommentComponent } from "./pages/comment/comment.component";
import { ArticleDetailComponent } from "./pages/article-detail/article-detail.component";
import { MineComponent } from "./pages/mine/mine.component";
import { ArticleListComponent } from "./pages/article-list/article-list.component";
import { MyFocusComponent } from "./pages/my-focus/my-focus.component";

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    swipe: {direction: Hammer.DIRECTION_HORIZONTAL},
  } as any;
}


@NgModule({
  declarations: [
    AppComponent,
    CommonLayoutComponent,
    NotFoundComponent,
    DocumentsComponent,
    MessageComponent,
    PostComponent,
    SectionComponent,
    CommentComponent,
    ArticleDetailComponent,
    MineComponent,
    ArticleListComponent,
    MyFocusComponent
  ],
  imports: [
    BrowserModule,
    HammerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    WeUiModule,
    InfiniteLoaderModule,
    ButtonModule,
    SearchBarModule,
    ToastModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSliderModule,
    MatTabsModule,
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
