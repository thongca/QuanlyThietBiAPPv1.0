import { Subscription } from 'rxjs/internal/Subscription';

import { SearchService } from './../../shared/search.service';
import { Router } from '@angular/router';
import { Component, OnDestroy, Inject, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from '../../_nav';
import { MenuDetailService } from '../../shared/menu-detail.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NavData } from '../../shared/menu';
// user info
import { UserInfoService } from '../../shared/user-info.service';
// url service
import { RootbaseUrlService } from './../../shared/rootbase-url.service';

import { searchRoot } from '../../shared/ketqua-tra-ve';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnDestroy, OnInit {
  todos$ = this.search.$search;
  private sub: Subscription;
  _listMenu: [
    {
      MenuID: '',
      name: '',
      url: '',
      icon: '',
      title: '',
      children: []
    }
  ];
  objUser_: {
    FullName: string;
    AvaUser: string;
  };
  avatarUser: string;
  _objbody: {
    error: number,
    data: []
  };
  s: string;
  m: any;
  public navItems: [];
  public sidebarMinimized = true;
  changes: MutationObserver;
  public element: HTMLElement;
  constructor(
    private sbaseUrl_: RootbaseUrlService,
    private suserInfo_: UserInfoService,
    public search: SearchService,
    private toastr: ToastrService,
    private menu: MenuDetailService,
    private router: Router, @Inject(DOCUMENT) _document?: any) {
    if (localStorage.getItem('token') === null || localStorage.getItem('token') === undefined) {
      this.router.navigateByUrl('/login');
    }
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
    this.avatarUser = this.sbaseUrl_.sbaseURL +  this.suserInfo_.R1_GetDataUser();
  }
  ngOnInit() {
    // tìm kiếm
    this.todos$.subscribe(res => {
      let ss = '';
      if (res === undefined || res === '') {
        ss = '';
      } else {
        ss = res;
      }
      this.s = ss;
    });
    this.menu.getDataMenu().subscribe(
      (res: any) => {
        if (res['body'].error === 1) {
          this.toastr.error('Bạn đã hết phiên đăng nhập. Vui lòng đăng nhập lại để tiếp tục!', 'Thông báo');
          localStorage.removeItem('listQuyen');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          sessionStorage.clear();
          this.router.navigateByUrl('/login');
          return false;
        }
        this.navItems = res.body.data;
      },
      err => {
        if (err.status === 400) {
          console.log(err);
        }
      }
    );
  }
  Search() {
    const _s = this.s as unknown as string;
    this.search.SearchRoot(_s);
  }
  LogOut(): void {
    localStorage.removeItem('listQuyen');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
  }
  ngOnDestroy(): void {
    this.changes.disconnect();
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
