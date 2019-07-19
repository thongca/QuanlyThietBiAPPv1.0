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
import { ThietbiService } from '../../components/danhmuc/thietbi/thietbi.service';
import { NhamayrootService } from '../../shared/nhamayroot.service';
import { NgxPermissionsService } from 'ngx-permissions';
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnDestroy, OnInit {
  @ViewChild('largeModal') public largeModal: ModalDirective;
  NhaMayID: number;
    // Nhà máy
    selectedItems: {
      NhaMayID: number;
      TenNhaMay: string;
    }[];
    dropdownSettings = {};

    // search
  todos$ = this.search.$search;
  private sub: Subscription;
  private sub1: Subscription;
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
  listNhaMay_: {
    NhaMayID: number;
    TenNhaMay: string;
  }[];
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
    public nhamayrootSer_: NhamayrootService,
    private toastr: ToastrService,
    private _userInfo: UserInfoService,
    private  permissionsService: NgxPermissionsService,
    private menu: MenuDetailService,
    private thietbiservice_: ThietbiService,
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
    if (this.suserInfo_.R1_GetDataUser() !== 'error') {
      this.avatarUser = this.sbaseUrl_.sbaseURL +  this.suserInfo_.R1_GetDataUser();
    } else {
      localStorage.clear();
      this.router.navigateByUrl('/login');
     return;
    }
    this.sub1 = this.menu.getDataMenu().subscribe(
      (res: any) => {
        if (res['body'].error === 1) {
          this.toastr.error('Bạn đã hết phiên đăng nhập. Vui lòng đăng nhập lại để tiếp tục!', 'Thông báo');
          localStorage.clear();
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
  ngOnInit() {
     // check permission admin
     let Permission = this._userInfo.r1GetobjPermission();
     if (Permission === undefined) {
       Permission = 'NoAdmin';
     }
     this.permissionsService.loadPermissions([`${Permission}`]);
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
    this.R1DanhSachNhaMay();
  }
    // danh sách nhà máy
    R1DanhSachNhaMay() {
      const Nhamayid = localStorage.getItem('NhaMayID');
      const model_ = { NhaMayID: this._userInfo.R1_GetNhaMayID() };
      this.thietbiservice_.r1GetNhaMay(model_).subscribe(res => {
        if (res !== undefined) {
          if (res['error'] === 1) {
            return false;
          }
          const data = res['data'];
          if (data !== undefined) {
            this.listNhaMay_ = data;
            if (Nhamayid !== null) {
              this.NhaMayID = Number(Nhamayid);
            } else {
              this.NhaMayID = this.listNhaMay_[0].NhaMayID;
              localStorage.setItem('NhaMayID',  JSON.stringify(this.NhaMayID));
            }
          }
        }
      }, err => {
        if (err.status === 500) {
          this.toastr.error('Mất kết nối đến máy chủ, Vui lòng kiểm tra lại đường dẫn!', 'Thông báo');
          return false;
        }
        if (err.status === 404) {
          this.toastr.error('Lỗi xác thực máy chủ, Vui lòng kiểm tra lại!', 'Thông báo');
          return false;
        }
      });
    }
  Search() {
    const _s = this.s as unknown as string;
    this.search.SearchRoot(_s);
  }
  showmodal() {
    this.largeModal.show();
  }
  HideModal() {
    this.largeModal.hide();
  }
  ThayDoiPhanXuongSanXuat() {
    const Nhamayid = JSON.stringify(this.NhaMayID);
  localStorage.setItem('NhaMayID', Nhamayid);
  this.nhamayrootSer_.NhaMaySer(Nhamayid);
  this.largeModal.hide();
  }
  LogOut(): void {
    localStorage.removeItem('listQuyen');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('NhaMayID');
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
  }
  ngOnDestroy(): void {
    this.changes.disconnect();
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }
}
