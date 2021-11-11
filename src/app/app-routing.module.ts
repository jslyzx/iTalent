import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './services/guards/auth.guard';
import {CommonLayoutComponent} from './pages/common-layout/common-layout.component';
import {LoginGuard} from './services/guards/login.guard';
import {DocumentsComponent} from './pages/documents/documents.component';
import {SectionComponent} from "./pages/section/section.component";
import {PostComponent} from "./pages/post/post.component";
import {MessageComponent} from "./pages/message/message.component";
import {CommentComponent} from "./pages/comment/comment.component";
import {ArticleDetailComponent} from "./pages/article-detail/article-detail.component";
import {MineComponent} from "./pages/mine/mine.component";
import {ArticleListComponent} from "./pages/article-list/article-list.component";
import {MyFocusComponent} from "./pages/my-focus/my-focus.component";


const routes: Routes = [
  {
    path: 'app',
    canActivate: [AuthGuard],
    component: CommonLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DocumentsComponent,
        pathMatch: 'full',
      },
      {
        path: 'mine',
        component: MineComponent,
        pathMatch: 'full',
      },
      {
        path: 'documents',
        component: DocumentsComponent,
        pathMatch: 'prefix',
      },
      {
        path: 'section/:sectionId',
        component: SectionComponent,
        pathMatch: 'full'
      },
      {
        path: 'article-list/:type',
        component: ArticleListComponent,
        pathMatch: 'full'
      },
      {
        path: 'post/:sectionId',
        component: PostComponent,
        pathMatch: 'full'
      },
      {
        path: 'message',
        component: MessageComponent,
        pathMatch: 'full',
      },
      {
        path: 'comment/:articleId',
        component: CommentComponent
      },
      {
        path: 'article/:articleId',
        component: ArticleDetailComponent
      },
      {
        path: 'my/focus',
        component: MyFocusComponent
      },
      {path: '**', component: DocumentsComponent}
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
