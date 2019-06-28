
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';

// import service
import { ModelHethongService } from '../model-hethong.service';
import { PhanquyenService } from './phanquyen.service';


// import kết quả trả về

import { resultList } from '../../../shared/ketqua-tra-ve';
import { ModalDirective} from 'ngx-bootstrap/modal';
import { Ketquatrave, rowGroupRole } from '../ketquatrave';
import { UserInfoService } from '../../../shared/user-info.service';
import { Subscription } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-phanmenunhomquyen',
  templateUrl: './phanmenunhomquyen.component.html',
  styleUrls: ['./phanmenunhomquyen.component.scss']
})
export class PhanmenunhomquyenComponent implements OnInit, OnDestroy {
  private options = {s: '', p: 1, pz: 20, totalpage: 0, total: 0, paxpz: 0, mathP: 0, PhongbanID: ''};
@ViewChild('largeModal') public largeModal: ModalDirective;
@ViewChild('dangerModal') public dangerModal: ModalDirective;
@ViewChild('warningModal') public warningModal: ModalDirective;
// Khai báo mảng
private sub: Subscription;
phongban_: [];
nhomuser: [
  {
    CompanyID: string,
    CreateDate: string,
    CreatorID: string,
    GroupRoleID: string,
    GroupRoleName: string,
    IsActive: boolean
    IsOrder: number,
    IsSelect: boolean,
    TenPhongBan: string,
    PhongbanID: string
  }
];
_menu: {
  error: number,
  data: [
    {
    IsOrder: number,
    MenuID: string,
    MenuName: string,
    MenuRank: number,
    RightAdd: boolean,
    RightDel: boolean,
    RightUpdate: boolean,
    RightView: boolean,
    RightExport: boolean,
    IsChange: boolean,
    }
  ]
};
_listGroupRole: {};


private subscription: Subscription;
private subscription1: Subscription;
// khai báo string
errormodal: string;
modeltitle: string;
GroupUserID: string;
PhongbanID: string;
  constructor(
    private modelService_: ModelHethongService,
    private phanquyenService_: PhanquyenService,
    private spinnerService: Ng4LoadingSpinnerService ,
    private hethongsv: ModelHethongService,
    private toastr: ToastrService,
    private _userInfo: UserInfoService,
    private  permissionsService: NgxPermissionsService,
  ) {
  }

  ngOnInit() {
        // check permission admin
        let Permission = this._userInfo.r1GetobjPermission();
        if (Permission === undefined) {
          Permission = 'NoAdmin';
        }
        this.permissionsService.loadPermissions([`${Permission}`]);
    this.spinnerService.show();
    this._menu = {
      error: 0,
      data: [
        {
          IsOrder: 0,
          MenuID: '',
          MenuName: '',
          MenuRank: 0,
          RightAdd: false,
          RightDel: false,
          RightUpdate: false,
          RightView: false,
          IsChange: false,
          RightExport: false,
          }
      ]
    };
    this.r1listNhomUser();
    this.r1getListPhongBan();
    this.spinnerService.hide();
  }
// view
r1listNhomUser() {
this.modelService_.r1GetDataGroupRole(this.options).toPromise().then(res => {
    if (res !== undefined) {
      this.nhomuser = res['data'];
     for (let i = 0; i < this.nhomuser.length; i++) {
      this.nhomuser[i].IsSelect = true;
      this.GroupUserID = this.nhomuser[i].GroupRoleID;
      this.PhongbanID = this.nhomuser[i].PhongbanID;
      this._listGroupRole =  this.nhomuser[i];
      break;
     }
     if (this.GroupUserID !== '') {
      this.r1listMenu();
     }
    }
  });
}

r1listMenu() {
 this.subscription = this.phanquyenService_.R1_GetDataMenu(this.GroupUserID, this.PhongbanID ).subscribe(res => {
    if (res['error'] === 1) {
      this.errormodal = res['ms'];
      this.dangerModal.show();
      return false;
    }
    this._menu = res['body'] as resultList;
  });
}
r1getListPhongBan() {
  this.subscription1 = this.hethongsv.r1GetDataPhongBan().subscribe(res => {
     if (res !== undefined) {
       this.phongban_ = res['data'];
     }
   });
 }
// thêm
LuuPhanQuyen() {
  const listMenu_ = this._menu.data.filter(c => c.IsChange === true);
  this.phanquyenService_.r1addPhanQuyen(listMenu_, this._listGroupRole).subscribe(res => {
    if (res['error'] === 1) {
      this.errormodal = res['ms'];
      this.dangerModal.show();
      return false;
    }
    this.r1listMenu();
    this.toastr.success('Lưu phân quyền thành công!', 'Thông báo');
  });
}

// bắt sự kiện

SelectRow(row: rowGroupRole) {
  this.nhomuser.forEach(element => {
    if (element.GroupRoleID === row.GroupRoleID) {
      element.IsSelect = true;
    } else {
      element.IsSelect = false;
    }
  });
  this._listGroupRole = row;
  this.GroupUserID = row.GroupRoleID;
  this.PhongbanID = row.PhongbanID;
  this.r1listMenu();
}
// ng change
phongBanChanged(PhongbanID) {
  this.options.PhongbanID = PhongbanID;
  this.r1listNhomUser();
}

subChange(row: Ketquatrave, check) {
 this._menu.data.forEach(x => {
  if (x === row) {
    x.IsChange = true;
  }
 });
 if (!check !== false) {
    row.RightView = true;
 }
}
subChangeView(row: Ketquatrave, check) {
  this._menu.data.forEach(x => {
    if (x === row) {
      x.IsChange = true;
    }
   });
   if (!check === false) {
      row.RightDel = false;
      row.RightUpdate = false;
      row.RightAdd = false;
      row.RightExport = false;
   }
}

ngOnDestroy () {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
}
}
