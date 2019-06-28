import { ModelHethongService } from './../model-hethong.service';
import { Data } from '@angular/router';
import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { ModalDirective} from 'ngx-bootstrap/modal';
import { Nhomnguoidung } from './nhomnguoidung.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { NhomnguoidungService } from './nhomnguoidung.service';
import * as $ from 'jquery';
// import searchroot
import { SearchService } from '../../../shared/search.service';
import { HttpHeaders } from '@angular/common/http';

// import khác

import { KetquaTraVe } from '../../../shared/ketqua-tra-ve';
import { UserInfoService } from '../../../shared/user-info.service';
import { PermissionComponent } from '../../../auth/permission/permission.component';
import { PermissionService } from '../../../shared/permission.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { NgxPermissionsService } from 'ngx-permissions';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';

@Component({
  selector: 'app-nhomnguoidung',
  templateUrl: './nhomnguoidung.component.html',
  styleUrls: ['./nhomnguoidung.component.scss']
})
export class NhomnguoidungComponent implements OnInit, OnDestroy  {
  // danh sách người dùng
  nguoidung_: [];
  // phòng ban
  phongban_: [];
  //
 model_: Nhomnguoidung;
  todos$ = this.s.$search;
 _model: Nhomnguoidung;
CheckLength: number;
options = {s: '', p: 1, pz: 20, totalpage: 0, total: 0, paxpz: 0, mathP: 0, PhongbanID: ''};

GroupRoleID: string;
nhomuser: any;
  public modeltitle: any;
  ketqua_: {
    error: number,
    ms: string,
    viewex: string
  };
  checkall: boolean;
  BaseUrl: string;
  private subscription: Subscription;
  private subscription1: Subscription;
  private subscription2: Subscription;
  errormodal: string;
  public imagePath;
  imgURL: any = '../../../../assets/img/avatars/user.png';
  public message: string;
  @ViewChild('largeModal') public largeModal: ModalDirective;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  @ViewChild('xsModal') public xsModal: ModalDirective;
  // tslint:disable-next-line:max-line-length
  constructor(
    private spinnerService: Ng4LoadingSpinnerService ,
     private s: SearchService,
     private _userInfo: UserInfoService,
     private toastr: ToastrService,
     private hethongsv: ModelHethongService,
     private groles_: NhomnguoidungService,
     private baseUrl_: RootbaseUrlService,
     private  permissionsService: NgxPermissionsService) {
      this.R1GetDataGroupRole();
      this.options.PhongbanID = '';
      this.BaseUrl = this.baseUrl_.sbaseURL;
     }
  SetTotalPage() {
    this.options.totalpage = Math.ceil(this.options.total / this.options.pz);
    this.options.mathP = this.options.pz * this.options.p;
}

  ngOnInit() {
        // check permission admin
        let Permission = this._userInfo.r1GetobjPermission();
        if (Permission === undefined) {
          Permission = 'NoAdmin';
        }
        this.permissionsService.loadPermissions([`${Permission}`]);

    this.todos$.subscribe(res => {
      if (res === undefined || res === '') {
        this.options.s = '';
        this.R1GetDataGroupRole();
      } else {
        this.options.s = res;
        this.R1GetDataGroupRole();
      }
    });
    this.model_ = {
      GroupRoleID: '',
    GroupRoleName: '',
    PhongbanID: '',
    IsActive: true,
    CreatorID: '',
    IsOrder: 0,
    CreateDate: '',
    };
    this.r1getListPhongBan();
  }

  // View thêm sửa xóa
  // view
  R1GetDataGroupRole() {
    this.subscription2 = this.groles_.R1_GetDataGroupRole(this.options).subscribe(res => {
      this.nhomuser = res['data'];
      this.options.total = res['total'];
        this.SetTotalPage();
        if (this.options.p > 1) {
            this.options.paxpz = (this.options.p - 1) * this.options.pz;
        } else {
          this.options.paxpz = 0;
        }

    });
  }
  r1getListPhongBan() {
    this.subscription1 = this.hethongsv.r1GetDataPhongBan().subscribe(res => {
       if (res !== undefined) {
         this.phongban_ = res['data'];
       }
     });
   }
  R2AdDataNhomNguoiDung(): boolean {
    this.model_.PhongbanID = this.options.PhongbanID as '';
    if (this.model_.GroupRoleName === '' || this.model_.GroupRoleName === null) {
  this.toastr.warning('Vui lòng nhập thông tin vào các trường có dấu (*)', 'Cảnh báo');
      return false;
    }
    if (this.model_.GroupRoleID === '' || this.model_.GroupRoleID === null) {
      this.spinnerService.show();
      this.groles_.R2AddNhomNguoiDung(this.model_).subscribe(res => {
        this.spinnerService.hide();
        this.ketqua_ = res['body'] as KetquaTraVe;
        if (this.ketqua_ !== undefined) {
          if (this.ketqua_.error === 1) {
            this.errormodal = this.ketqua_.ms;
            this.dangerModal.show();
            return false;
          } else {
            this.toastr.success('Thêm mới nhóm người dùng thành công!', 'Thông báo');
            this.R1GetDataGroupRole();
            this.largeModal.hide();
          }
        }
      });
    } else {
      this.spinnerService.show();
      this.groles_.r3updateNhomNguoiDung(this.GroupRoleID, this.model_).subscribe(res => {
        this.spinnerService.hide();
          if (res !== undefined) {
            if (res['error'] === 1) {
              this.errormodal = res['ms'];
              return false;
            }
            if (res['error'] === 2) {
              this.errormodal = res['ms'];
              this.toastr.warning(res['ms'], 'Cảnh báo!');
              return false;
            }
            this.toastr.success('Sửa nhóm người dùng thành công!', 'Thông báo');
            this.R1GetDataGroupRole();
            this.largeModal.hide();
          }
      });
    }

  }

SelectIDEditModel(GroupRoleID) {
  this.modeltitle = 'Sửa nhóm người dùng';
  this.GroupRoleID = GroupRoleID;
 this.subscription =  this.groles_.R1_GetDataByID(GroupRoleID).subscribe(res => {
    if (res !== undefined) {
      if (res['error']  === 1) {
        this.errormodal = res['ms'];
      }
     this.model_ = res['appSysGroupRoles'];
    }
  });
  this.largeModal.show();
}
Showmodal(check) {
  if (check === 'add') {
    this.modeltitle = 'Thêm mới nhóm người dùng';
    // tslint:disable-next-line:max-line-length
    this.model_ = {GroupRoleID: '', GroupRoleName: '', PhongbanID: '', IsActive: true, CreatorID: '',  IsOrder: 0, CreateDate: '', };
    // nếu thêm mới thì đưa img về mặc định
    this.largeModal.show();
  } else {
}
}
// modal
modalUserInGroup(GroupRoleID) {
this.groles_.r1GetuserByGroupRoleID(GroupRoleID).subscribe(res => {
  if (res['error'] === 1) {
    this.toastr.error(res['ms'], 'Thông báo lỗi');
    return false;
  }
  this.xsModal.show();

  this.nguoidung_ = res['data'];
  console.log(res['data']);
});
}
// change

phongBanChanged(PhongbanID) {
  this.options.PhongbanID = PhongbanID;
  this.R1GetDataGroupRole();
}

HideModal() {
  this.largeModal.hide();
  this.R1GetDataGroupRole();
}


xacnhanXoa() {
  if (this.CheckLength > 0) {
    this.DelUser();
  }
}
DelUser() {
  const listxoa_ = this.nhomuser.filter(x => x.checked === true);
  this.groles_.r3deleteNhomNguoiDung(listxoa_).subscribe(res => {
    if (res !== undefined) {
      if (res['error'] === 1) {
        this.errormodal = res['ms'];
        return false;
      }
      this.warningModal.hide();
      this.CheckLength = 0;
      this.R1GetDataGroupRole();
    }
  });
}

// checked
toggleAll (rowto, checked) {
  this.CheckLength = 0;
  rowto.forEach(function (value, key) {
      rowto[key].checked = !checked;
  });
  const listvitrual = this.nhomuser.filter(c => c.checked === true);
  this.CheckLength = listvitrual.length;
}
CheckedList(checked) {
  if (!checked === true) {
    this.CheckLength = 1;
  } else {
    this.CheckLength = 0;
  }

}


// Tìm kiếm
// Phân trang
NextPage() {
  if (this.options.p < this.options.totalpage) {
  this.options.p++;
  this.R1GetDataGroupRole();
  }
}

PrevPage() {
  if (this.options.p > 1) {
  this.options.p--;
  this.R1GetDataGroupRole();
  }
}

// làm mới trang
refreshData() {
  this.options.s = '';
  this.s.SearchRoot(this.options.s);
  this.options.p = 1;
  this.toastr.success('Tải lại trang thành công', 'Thông báo');
}

ngOnDestroy() {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
  if (this.subscription1) {
    this.subscription1.unsubscribe();
  }
  if (this.subscription2) {
    this.subscription2.unsubscribe();
  }
}
}
