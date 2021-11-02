import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {AuthGuard} from './services/guards/auth.guard';
import {LoginComponent} from './pages/login/login.component';
import {CommonLayoutComponent} from './pages/common-layout/common-layout.component';
import {LoginGuard} from './services/guards/login.guard';
import {PdfDetailComponent} from './pages/pdf-detail/pdf-detail.component';
import {DocumentsComponent} from './pages/documents/documents.component';
import {DocDetailComponent} from './pages/doc-detail/doc-detail.component';
import {ImageDetailComponent} from "./pages/image-detail/image-detail.component";
import {CoursesComponent} from "./pages/courses/courses.component";
import {CourseDetailComponent} from "./pages/course-detail/course-detail.component";
import {SectionComponent} from "./pages/section/section.component";
import {PostComponent} from "./pages/post/post.component";
import {MessageComponent} from "./pages/message/message.component";
import {CommentComponent} from "./pages/comment/comment.component";
import {ArticleDetailComponent} from "./pages/article-detail/article-detail.component";


const routes: Routes = [
  {
    path: '',
    canActivate: [LoginGuard],
    component: LoginComponent,
    pathMatch: 'full'
  },
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
        path: 'documents',
        component: DocumentsComponent,
        pathMatch: 'prefix',
      },
      {
        path: 'documents/:categoryId',
        component: DocumentsComponent,
        pathMatch: 'full',
      },
      {
        path: 'pdf/:pdfId',
        component: PdfDetailComponent,
      },
      {
        path: 'section/:sectionId',
        component: SectionComponent,
        pathMatch: 'full'
      },
      {
        path: 'post/:sectionId',
        component: PostComponent,
        pathMatch: 'full'
      },
      {
        path: 'image/:imageId',
        component: ImageDetailComponent,
      },
      {
        path: 'doc/:docId',
        component: DocDetailComponent,
      },
      {
        path: 'courses',
        component: CoursesComponent,
      },
      {
        path: 'message',
        component: MessageComponent,
        pathMatch: 'full',
      },
      {
        path: 'course/:courseId',
        component: CourseDetailComponent,
      },
      {
        path: 'comment/:articleId',
        component: CommentComponent
      },
      {
        path: 'article/:articleId',
        component: ArticleDetailComponent
      },
      {path: '**', component: DashboardComponent},
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
