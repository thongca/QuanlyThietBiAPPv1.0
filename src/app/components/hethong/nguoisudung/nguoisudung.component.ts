import { UserInfoService } from './../../../shared/user-info.service';
import { NhomnguoidungService } from './../nhomnguoidung/nhomnguoidung.service';
import { HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { ModelHethongService } from '../model-hethong.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as $ from 'jquery';
import { User } from '../user.model';
import { map, filter } from 'rxjs/operators';
import {  DelUser, ResAdd } from '../nguoisudung';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';
// import searchroot
import { SearchService } from '../../../shared/search.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { ThietbiService } from '../../danhmuc/thietbi/thietbi.service';
import { NhamayrootService } from '../../../shared/nhamayroot.service';

@Component({
  selector: 'app-nguoisudung',
  templateUrl: './nguoisudung.component.html',
  styleUrls: ['./nguoisudung.component.scss']
})
export class NguoisudungComponent implements OnInit, OnDestroy {
  // Nhà máy
  selectedItems: {
    NhaMayID: number;
    TenNhaMay: string;
  }[];
  dropdownSettings = {};
  // phòng ban
  phongban_: {
    PhongbanID: string,
    TenPhongBan: string
  }[];
  ModelNhaMay: any;
  // search
  todos$ = this.s.$search;
  // nhà máy
  nhaMayID$ = this.nhaMaySevice_.$nhaMayID;
  public list: {
    error: '',
    data: [
      {
        UserID: '';
        UserName: '';
        Password: '';
        FullName: '';
        Email: '';
        PhoneNumber: '';
        PhongbanID: '',
        Address: '';
        IsOrder: 0;
        IsActive: true;
        IsAdmin: false;
        AvaUser: '';
        BirthDay: '';
        SexUser: true;
        GroupRoleID: string;
        LaTruongPhong: false;
        BanGiamDoc: false;
    }
    ],
    total: 0
  };
   errormodal: string;
 result: ResAdd;
 CheckLength: number;
 checkall: boolean;
dataservice: any;
_users: DelUser;
options = {s: '', p: 1, pz: 20, totalpage: 0, total: 0, paxpz: 0, mathP: 0, PhongbanID: '', NhaMayID: null};
// khai báo thông tin đăng nhập
usercontext_: {};

// nhóm người dùng
optionl_ = {s: '', p: 1, pz: 100000};
nhomuser: any;
BaseUrl: string;
UserID: '';
ListPages = [];
  modeltitle = 'Cập nhật dữ liệu';
  user: User;
 _files: any;
imagePath;
subscription: Subscription;
 subscription1: Subscription;
  imgURL: any = '../../../../assets/img/avatars/user.png';
  public message: string;
  @ViewChild('largeModal') public largeModal: ModalDirective;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  listNhaMay_: {
    NhaMayID: number;
    TenNhaMay: string;
  }[];
  // tslint:disable-next-line:max-line-length
  constructor(private spinnerService: Ng4LoadingSpinnerService ,
     private s: SearchService,
     private nhaMaySevice_: NhamayrootService,
     private _userInfo: UserInfoService,
     private hethongsv: ModelHethongService,
     private _nhomngdservice: NhomnguoidungService,
     private baseUrl_: RootbaseUrlService,
     private  permissionsService: NgxPermissionsService,
     private thietbiservice_: ThietbiService,
      private toastr: ToastrService) {
        this.BaseUrl = this.baseUrl_.sbaseURL;
        this.user = {
          UserID: '',
          UserName: '',
          Password: '',
          FullName: '',
          Email: '',
          PhoneNumber: '',
          Address: '',
          IsOrder: 0,
          PhongbanID: '',
          IsActive: true,
          IsAdmin: false,
          AvaUser: '',
          BirthDay: '',
          SexUser: true,
          GroupRoleID: '',
          GroupRoleName: '',
          BanGiamDoc: false,
          LaTruongPhong: false,
          NhaMayID: null,
        };
        this.listNhaMay_ = [{
          NhaMayID: null,
          TenNhaMay: ''
        }];
       }
  SetTotalPage() {
    this.options.totalpage = Math.ceil(this.options.total / this.options.pz);
    this.options.mathP = this.options.pz * this.options.p;
}

  ngOnInit() {
    this.selectedItems = this.listNhaMay_.filter(x => x.NhaMayID === this.listNhaMay_[0].NhaMayID);
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'NhaMayID',
      textField: 'TenNhaMay',
      selectAllText: 'Chọn tất cả',
      unSelectAllText: 'Bỏ chọn tất cả',
      itemsShowLimit: 1,
      allowSearchFilter: false
    };
        // check permission admin
        let Permission = this._userInfo.r1GetobjPermission();
        if (Permission === undefined) {
          Permission = 'NoAdmin';
        }
        this.permissionsService.loadPermissions([`${Permission}`]);

    // tìm kiếm
    this.todos$.subscribe(res => {
      if (res === undefined || res === '') {
        this.options.s = '';
        this.R1GetDataUser();
      } else {
        this.options.s = res;
        this.R1GetDataUser();
      }
    });
    this.nhaMayID$.subscribe(res => {
      if (res !== undefined) {
        this.R1GetDataUser();
        this.r1getListNhomQuyen();
        this.r1getListPhongBan();
      }
    });
    this.r1getListNhomQuyen();
    this.r1getListPhongBan();
  }
 openAttachfile (check) {
    if (check === 'works') {
        $('input.inputimgFileWorks').click();
    }
}
SelectIDEditModel(UserID) {
  this.modeltitle = 'Sửa người sử dụng';
  this.UserID = UserID;
  this.hethongsv.R1GetUserByID(UserID).subscribe(res => {
 this.user = res['data'];
 this.ModelNhaMay = res['datanm'];
 this.largeModal.show();
 this.imgURL = this.BaseUrl +  this.hethongsv.ObjUserByID.AvaUser;
  }
  );
}
Showmodal(check) {
  if (check === 'add') {
    this.modeltitle = 'Thêm mới người sử dụng';
    let PhongbanID = '';
    if (this.user.PhongbanID !== undefined) {
      PhongbanID = this.user.PhongbanID;
    }
    // tslint:disable-next-line:max-line-length
    this.user = {UserID: '', UserName: '', Password: '', FullName: '', Email: '',  PhoneNumber: '', PhongbanID: PhongbanID , Address: '', IsOrder: 0,  IsActive: true,  IsAdmin: false, AvaUser: '',  BirthDay: '',  SexUser: true, GroupRoleID: '', GroupRoleName: '', LaTruongPhong: false, BanGiamDoc: false, NhaMayID: null };
    // nếu thêm mới thì đưa img về mặc định
    this.imgURL = '../../../../assets/img/avatars/user.png';
    this.largeModal.show();
  } else {
    this.dataservice = this.hethongsv.list.data;
    this.largeModal.hide();
}
}
HideModal() {
  this.largeModal.hide();
  this.R1GetDataUser();
}
  preview(files) {
    if (files.length === 0) {
      return;
    }
    // tslint:disable-next-line:prefer-const
    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }
    this._files = files;
    // tslint:disable-next-line:prefer-const
    let reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }

R3_AddUser(): boolean {
if (this.user.UserName  === '' || this.user.FullName === '' || this.user.Password === '') {
this.errormodal = 'Vui lòng nhập dữ liệu vào các trường có dấu (*)';
  this.dangerModal.show();
return false;
}
  if (this.user.UserID === null || this.user.UserID === '') {
    this.spinnerService.show();
    this.hethongsv.R3_AddUserservice(this._files, this.user, this.ModelNhaMay)
    .subscribe(next => {
      this.result =  next['body'] as ResAdd ;
      if (this.result !== undefined) {
        if (this.result.error === 1) {
          this.errormodal = this.result.ms;
          this.dangerModal.show();
          this.spinnerService.hide();
       } else {
        this.R1GetDataUser();
        this.largeModal.hide();
        this.spinnerService.hide();
       }
      }
    });
  } else {
    this.hethongsv.R2UpdateUser(this._files, this.user, this.ModelNhaMay).then(res => {
      this.R1GetDataUser();
    }).catch();
    this.largeModal.hide();
 }

}
xacnhanXoa() {
  if (this.CheckLength > 0) {
    this.DelUser();
  }
}
DelUser() {
  this._users = this.dataservice.filter(x => x.checked === true);
  this.hethongsv.R4_deleteUser(this._users).then(res => {
    this.R1GetDataUser();
    this.CheckLength = 0;
    this.warningModal.hide();
  }).catch(
  );
}
R1GetDataUser() {
  this.options.NhaMayID = Number(localStorage.getItem('NhaMayID'));
  this.hethongsv.R1_GetDataUser(this.options).then((res: any) => {
    this.dataservice = this.hethongsv.list.data;
    this.options.total = this.hethongsv.list.total;
    this.SetTotalPage();
    if (this.options.p > 1) {
        this.options.paxpz = (this.options.p - 1) * this.options.pz;
    } else {
      this.options.paxpz = 0;
    }

  });
}
r1getListNhomQuyen() {
 this.subscription = this.hethongsv.R1_GetDataGroupRole().subscribe(res => {
    if (res !== undefined) {
      this.nhomuser = res['data'];
    }
  });
}
r1getListPhongBan() {
  this.subscription1 = this.hethongsv.r1GetDataPhongBan().subscribe(res => {
     if (res !== undefined) {
       this.phongban_ = res['data'];
       this.user.PhongbanID = this.phongban_[0].PhongbanID;
     }
   });
 }
// checked
toggleAll (rowto, checked) {
  this.CheckLength = 0;
  rowto.forEach(function (value, key) {
      rowto[key].checked = !checked;
  });
   const listvitrual = this.dataservice.filter(c => c.checkbox === true);
   this.CheckLength = listvitrual.length;
}
CheckedList(checked) {
  if (!checked === true) {
    this.CheckLength = 1;
  } else {
    this.CheckLength = 0;
  }

}
// ng change
phongBanChanged(PhongbanID) {
  this.options.PhongbanID = PhongbanID;
  this.R1GetDataUser();
}
ChangeNhaMay() {
  this.R1GetDataUser();
  }
// Tìm kiếm
// Phân trang
NextPage() {
  if (this.options.p < this.options.totalpage) {
  this.options.p++;
  this.R1GetDataUser();
  }
}

PrevPage() {
  if (this.options.p > 1) {
  this.options.p--;
  this.R1GetDataUser();
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
}
}
