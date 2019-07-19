import { AuthGuard } from './auth/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import component
import { DefaultLayoutComponent } from './containers/default-layout';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { TrangchuComponent } from './trangchuapp/trangchu/trangchu.component';


const routes: Routes = [
  {
    path: 'home',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Trang chủ'
    }
  },
{
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        canActivateChild: [AuthGuard],
        path: 'hethong',
        loadChildren: './components/hethong/hethong.module#HethongModule',
        data: {routeLink: '/hethong'}
      },
      {
        canActivateChild: [AuthGuard],
        path: 'danhmuc',
        loadChildren: './components/danhmuc/danhmuc.module#DanhmucModule',
        data: {routeLink: '/danhmuc'}
      },
      {
        canActivateChild: [AuthGuard],
        path: 'tacvu',
        loadChildren: './components/tacvu/tacvu.module#TacvuModule',
        data: {routeLink: '/tacvu'}
      },
      {
        canActivateChild: [AuthGuard],
        path: 'baocao',
        loadChildren: './components/baocao/baocao.module#BaocaoModule',
        data: {routeLink: '/baocao'}
      },
      {
        path: 'trangchu',
        component: TrangchuComponent,
        data: {
          title: 'Trang chủ'
        }
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
