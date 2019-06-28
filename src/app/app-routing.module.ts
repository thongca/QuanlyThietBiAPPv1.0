import { AuthGuard } from './auth/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import component
import { DefaultLayoutComponent } from './containers/default-layout';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';


const routes: Routes = [
  {
    path: 'trangchu',
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
        path: 'base',
        canActivate: [AuthGuard],
        loadChildren: './views/base/base.module#BaseModule'
      },
      {
        canActivate: [AuthGuard],
        path: 'buttons',
        loadChildren: './views/buttons/buttons.module#ButtonsModule'
      },
      {
        path: 'charts',
        loadChildren: './views/chartjs/chartjs.module#ChartJSModule'
      },
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'icons',
        loadChildren: './views/icons/icons.module#IconsModule'
      },
      {
        path: 'notifications',
        loadChildren: './views/notifications/notifications.module#NotificationsModule'
      },
      {
        path: 'theme',
        loadChildren: './views/theme/theme.module#ThemeModule'
      },
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
