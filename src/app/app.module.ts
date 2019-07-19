import { TacvuModule } from './components/tacvu/tacvu.module';
import { SearchService } from './shared/search.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';
import { MenuDetailService } from './shared/menu-detail.service';
// Import containers
import { DefaultLayoutComponent } from './containers';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

// captcha
import { BotDetectCaptchaModule, CaptchaComponent } from 'angular-captcha';
const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';


// import module inside software
import { HethongModule } from './components/hethong/hethong.module';
import { DanhmucModule } from './components/danhmuc/danhmuc.module';
// toarst
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
 // spiner
 import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

 // modal
 import { ModalModule } from 'ngx-bootstrap/modal';
import { searchRoot } from './shared/ketqua-tra-ve';
import { DanhmucComponent } from './components/danhmuc/danhmuc.component';


// Import your ngx-Permissions
import { NgxPermissionsModule } from 'ngx-permissions';
import { PermissionComponent } from './auth/permission/permission.component';
import { TacvuComponent } from './components/tacvu/tacvu.component';

import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

// cookie
import { CookieService } from 'ngx-cookie-service';
import { TrangchuComponent } from './trangchuapp/trangchu/trangchu.component';

@NgModule({

  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    DanhmucComponent,
    PermissionComponent,
    TacvuComponent,
    TrangchuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    HethongModule,
    DanhmucModule,
    TacvuModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      progressBar: true,
      closeButton: true,
      progressAnimation: 'decreasing',
      tapToDismiss: true,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    Ng4LoadingSpinnerModule.forRoot(),
    ModalModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BotDetectCaptchaModule,
    NgMultiSelectDropDownModule,
  ],
  providers: [
    {
    provide: LocationStrategy,
    useClass: HashLocationStrategy,
  }, MenuDetailService,
SearchService,
searchRoot,
CookieService],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
