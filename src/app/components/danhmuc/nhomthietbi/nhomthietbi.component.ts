import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SearchService } from '../../../shared/search.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { UserInfoService } from '../../../shared/user-info.service';
import { NhomthietbiService } from './nhomthietbi.service';

@Component({
  selector: 'app-nhomthietbi',
  templateUrl: './nhomthietbi.component.html',
  styleUrls: ['./nhomthietbi.component.scss']
})
export class NhomthietbiComponent implements OnInit, OnDestroy {
  // phân trang
 options = {s: '', p: 1, pz: 20, totalpage: 0, total: 0, paxpz: 0, mathP: 0};
 checkall: boolean;
  // subscript
  private subscription: Subscription;
  private subscription1: Subscription;

  // modal
  @ViewChild('largeModal') public largeModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;

  // tìm kiếm
  todos$ = this.s.$search;

  // string
  public modeltitle: string;
  CheckLength: number;
  NhomThietBiID: string;
  errormodal: string;
  // obj
  modelnhomthietbi_: {
    NhomThietBiID: string;
    MaNhom: string;
    TenNhom: string;
  };

  // list
  listnhomthietbi_: {
    NhomThietBiID: string;
    MaNhom: string;
    TenNhom: string;
    checked: boolean;
  }[];

  constructor(
      private spinnerService: Ng4LoadingSpinnerService ,
     private s: SearchService,
     private _userInfo: UserInfoService,
     private toastr: ToastrService,
     private  permissionsService: NgxPermissionsService,
     private nhomtbservice_: NhomthietbiService
  ) { }

  ngOnInit() {
    this.modelnhomthietbi_ = {
      NhomThietBiID: '',
      MaNhom: '',
      TenNhom: ''
    };
     // check permission admin
     if (this._userInfo.user.IsAdmin === undefined) {
      this._userInfo.user.IsAdmin = false;
    }
    this.permissionsService.loadPermissions([`${this._userInfo.user.IsAdmin}`]);

    // tìm kiếm
    this.todos$.subscribe(res => {
      if (res === undefined || res === '') {
        this.options.s = '';
        this.R1GetListNhomThietBi();
      } else {
        this.options.s = res;
        this.R1GetListNhomThietBi();
      }
    });

  }
  SetTotalPage() {
    this.options.totalpage = Math.ceil(this.options.total / this.options.pz);
    this.options.mathP = this.options.pz * this.options.p;
}
// danh sách nhóm thiết bị
R1GetListNhomThietBi() {
  this.spinnerService.show();
   this.subscription1 = this.nhomtbservice_.r1ListNhomThietBi(this.options).subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.listnhomthietbi_ = res['data'];
      this.options.total = res['total'];
      this.SetTotalPage();
      if (this.options.p > 1) {
          this.options.paxpz = (this.options.p - 1) * this.options.pz;
      } else {
        this.options.paxpz = 0;
      }
});
}
Showmodal(check) {
  if (check === 'add') {
    this.modeltitle = 'Thêm mới nhóm thiết bị';
    // tslint:disable-next-line:max-line-length
    this.modelnhomthietbi_ = {NhomThietBiID: '', TenNhom: '', MaNhom: ''};
    this.largeModal.show();
  } else {
}
}
// modal
modalUserInGroup(NhomThietBiID) {
// this.nhomtbservice_.r1GetnhomTBbyID(NhomThietBiID).subscribe(res => {
//   if (res['error'] === 1) {
//     this.toastr.error(res['ms'], 'Thông báo lỗi');
//     return false;
//   }
// });
}


// thêm mới, sửa nhóm thiết bị
R2AdDataNhomNguoiDung(): boolean {
  if (this.modelnhomthietbi_.TenNhom === '' || this.modelnhomthietbi_.MaNhom === '') {
this.toastr.warning('Vui lòng nhập thông tin vào các trường có dấu (*)', 'Cảnh báo');
    return false;
  }
  if (this.modelnhomthietbi_.NhomThietBiID === '' || this.modelnhomthietbi_.NhomThietBiID === null) {
    this.spinnerService.show();
    this.nhomtbservice_.R2AddNhomThietBi(this.modelnhomthietbi_).subscribe(res => {
      this.spinnerService.hide();
      if (res !== undefined) {

          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          } else {
            this.toastr.success('Thêm mới nhóm thiết bị thành công.', 'Thông báo');
            this.R1GetListNhomThietBi();
            this.largeModal.hide();
          }
      }
    });
  } else {
    this.spinnerService.show();
    this.nhomtbservice_.r3updateNhomThietBi(this.NhomThietBiID, this.modelnhomthietbi_).subscribe(res => {
      this.spinnerService.hide();
        if (res !== undefined) {
          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          }
          this.toastr.success('Sửa nhóm thiết bị thành công!', 'Thông báo');
          this.R1GetListNhomThietBi();
          this.largeModal.hide();
        }
    });
  }

}
// modal
SelectIDEditModel(NhomThietBiID: string) {
  this.modeltitle = 'Sửa nhóm nhóm thiết bị';
  this.NhomThietBiID = NhomThietBiID;
 this.subscription =  this.nhomtbservice_.r1GetnhomTBbyID(NhomThietBiID).subscribe(res => {
    if (res !== undefined) {
      if (res['error']  === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
      }
     this.modelnhomthietbi_ = res['data'];
    }
    this.largeModal.show();
  });
}

HideModal() {
  this.largeModal.hide();
  this.R1GetListNhomThietBi();
}


xacnhanXoa(rowto) {
  if (this.CheckLength > 0) {
    this.r4DelNhomThietBi(rowto);
  }
}
r4DelNhomThietBi(rowto) {
 const arr = [
  ];
  rowto.forEach(function (item) {
    if (item.checked) {
      const obj = {NhomThietBiID: item.NhomThietBiID};
     arr.push(obj);
    }
});
  this.nhomtbservice_.r4deleteNhomThietBi(arr).subscribe(res => {
    if (res !== undefined) {
      if (res['error'] === 1) {
      this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.warningModal.hide();
      this.toastr.success('Xóa thành công nhóm thiết bị', 'Thông báo');
      this.CheckLength = 0;
      this.R1GetListNhomThietBi();
    }
  });
}

// checked
toggleAll (rowto, checked) {
  this.CheckLength = 0;
  rowto.forEach(function (value, key) {
      rowto[key].checked = !checked;
  });
  const listvitrual = this.listnhomthietbi_.filter(c => c.checked === true);
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
  this.R1GetListNhomThietBi();
  }
}

PrevPage() {
  if (this.options.p > 1) {
  this.options.p--;
  this.R1GetListNhomThietBi();
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
  // if (this.subscription2) {
  //   this.subscription2.unsubscribe();
  // }
}
}
