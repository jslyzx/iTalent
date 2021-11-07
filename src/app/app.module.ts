import {BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ButtonModule, InfiniteLoaderModule, SearchBarModule, ToastModule, WeUiModule} from 'ngx-weui';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {LoginComponent} from './pages/login/login.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {PageComponent} from './pages/page/page.component';
import {CommonLayoutComponent} from './pages/common-layout/common-layout.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {AuthInterceptor} from './services/auth.interceptor';
import {FormsModule} from '@angular/forms';
import {MatSliderModule} from '@angular/material/slider';
import {PdfDetailComponent} from './pages/pdf-detail/pdf-detail.component';
import {NgxExtendedPdfViewerModule} from 'ngx-extended-pdf-viewer';
import {DocumentsComponent} from './pages/documents/documents.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DocDetailComponent} from './pages/doc-detail/doc-detail.component';
import {MatTabsModule} from '@angular/material/tabs';
import * as Hammer from 'hammerjs';
import {ImageDetailComponent} from "./pages/image-detail/image-detail.component";
import { CoursesComponent } from './pages/courses/courses.component';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';
import { MessageComponent } from './pages/message/message.component';
import { PostComponent } from './pages/post/post.component';
import { SectionComponent } from './pages/section/section.component';
import { CommentComponent } from "./pages/comment/comment.component";
import { ArticleDetailComponent } from "./pages/article-detail/article-detail.component";
import { MineComponent } from "./pages/mine/mine.component";
import { ArticleListComponent } from "./pages/article-list/article-list.component";

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
    PageComponent,
    DashboardComponent,
    LoginComponent,
    NotFoundComponent,
    PdfDetailComponent,
    ImageDetailComponent,
    DocDetailComponent,
    DocumentsComponent,
    CoursesComponent,
    CourseDetailComponent,
    MessageComponent,
    PostComponent,
    SectionComponent,
    CommentComponent,
    ArticleDetailComponent,
    MineComponent,
    ArticleListComponent
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
    NgxExtendedPdfViewerModule,
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
