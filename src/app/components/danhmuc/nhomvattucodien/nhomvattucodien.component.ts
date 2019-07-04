import { NhomvattucodienService } from './nhomvattucodien.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SearchService } from '../../../shared/search.service';
import { UserInfoService } from '../../../shared/user-info.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { Nhomvattucodien } from './nhomvattucodien.model';

@Component({
  selector: 'app-nhomvattucodien',
  templateUrl: './nhomvattucodien.component.html',
  styleUrls: ['./nhomvattucodien.component.scss']
})
export class NhomvattucodienComponent implements OnInit, OnDestroy {
  options = {s: '', p: 1, pz: 20, totalpage: 0, total: 0, paxpz: 0, mathP: 0};

  // subscript
  private subscription: Subscription;
  private subscription1: Subscription;

  // modal
  @ViewChild('largeModal') public largeModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  // tìm kiếm
  todos$ = this.s.$search;
  checkall: boolean;
  // string
  public modeltitle: string;
  CheckLength: number;
  NhomVatTuID: string;
  errormodal: string;
  // obj
  modelnhomvattu_: Nhomvattucodien;

  // list
  listNhomVatTu_: Nhomvattucodien[];


  constructor(
      private spinnerService: Ng4LoadingSpinnerService ,
     private s: SearchService,
     private _userInfo: UserInfoService,
     private toastr: ToastrService,
     private  permissionsService: NgxPermissionsService,
     private nhomvtservice_: NhomvattucodienService
  ) {
    this.modelnhomvattu_ = {
      NhomVatTuID:  '',
      MaNhom:  '',
      TenNhom:  '',
      ThuTu:  0,
      IsActive: true,
      checked: false
    };
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
      if (res === undefined || res === '') {
        this.options.s = '';
        this.R1GetListNhomVatTu();
      } else {
        this.options.s = res;
        this.R1GetListNhomVatTu();
      }
    });

  }
  SetTotalPage() {
    this.options.totalpage = Math.ceil(this.options.total / this.options.pz);
    this.options.mathP = this.options.pz * this.options.p;
}


// danh sách đơn vị tính
R1GetListNhomVatTu() {
  this.CheckLength = 0;
  this.spinnerService.show();
   this.subscription = this.nhomvtservice_.r1ListNhomVatTu(this.options).subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.listNhomVatTu_ = res['data'];
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
    this.modeltitle = 'Thêm mới nhóm vật tư';
    // tslint:disable-next-line:max-line-length
    this.modelnhomvattu_ = {
      NhomVatTuID:  '',
      MaNhom:  '',
      TenNhom:  '',
      ThuTu:  0,
      IsActive: true,
      checked: false
    };
    this.largeModal.show();
  } else {
}
}
// modal
modalUserInGroup(DonViTinhID) {
// this.donviservice_.r1GetnhomTBbyID(DonViTinhID).subscribe(res => {
//   if (res['error'] === 1) {
//     this.toastr.error(res['ms'], 'Thông báo lỗi');
//     return false;
//   }
// });
}

// thêm mới, sửa nhóm vật tư
R2AdDataNhomVatTu(): boolean {
  if (this.modelnhomvattu_.TenNhom === '') {
  this.toastr.warning('Vui lòng nhập thông tin vào các trường có dấu (*)', 'Cảnh báo');
    return false;
  }
  if (this.modelnhomvattu_.NhomVatTuID === '' || this.modelnhomvattu_.NhomVatTuID === null) {
    this.spinnerService.show();
    this.nhomvtservice_.R2AddNhomVatTu(this.modelnhomvattu_).subscribe(res => {
      this.spinnerService.hide();
      if (res !== undefined) {

          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          } else {
            this.toastr.success('Thêm mới nhóm vật tư thành công thành công.', 'Thông báo');
            this.R1GetListNhomVatTu();
            this.largeModal.hide();
          }
      }
    });
  } else {
    this.spinnerService.show();
    this.nhomvtservice_.r3updateNhomVatTu(this.NhomVatTuID, this.modelnhomvattu_).subscribe(res => {
      this.spinnerService.hide();
        if (res !== undefined) {
          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          }
          this.toastr.success('Sửa nhóm vật tư thành công!', 'Thông báo');
          this.R1GetListNhomVatTu();
          this.largeModal.hide();
        }
    }, err => {
      if (err.status === 500) {
        this.toastr.success('Mất kết nối đến máy chủ, Vui lòng kiểm tra lại đường dẫn hoặc liên hệ quản trị viên!', 'Thông báo');
        return false;
      }
    });
  }

}
// modal
SelectIDEditModel(NhomVatTuID: string) {
  this.modeltitle = 'Sửa nhóm vật tư';
  this.NhomVatTuID = NhomVatTuID;
 this.subscription1 =  this.nhomvtservice_.r1GetNVTbyID(NhomVatTuID).subscribe(res => {
    if (res !== undefined) {
      if (res['error']  === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      } else if (res['error']  === 0) {
        this.modelnhomvattu_ = res['data'];
        this.largeModal.show();
      }
    }
  });
}

HideModal() {
  this.largeModal.hide();
  this.R1GetListNhomVatTu();
}


xacnhanXoa(rowto) {
  if (this.CheckLength > 0) {
    this.r4DelNhomVatTu(rowto);
  }
}
r4DelNhomVatTu(rowto) {
 const arr = [
  ];
  rowto.forEach(function (item) {
    if (item.checked) {
      const obj = {NhomVatTuID: item.NhomVatTuID};
     arr.push(obj);
    }
});
  this.nhomvtservice_.r4deleteNhomVatTu(arr).subscribe(res => {
    if (res !== undefined) {
      if (res['error'] === 1) {
      this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.warningModal.hide();
      this.toastr.success('Nhóm vật tư ' + res['ms'] + ' đã tồn tại dữ liệu liên quan, Vui lòng kiểm tra lại!', 'Thông báo');
      this.R1GetListNhomVatTu();
    }
  });
}

// checked
toggleAll (rowto, checked) {
  this.CheckLength = 0;
  rowto.forEach(function (value, key) {
      rowto[key].checked = !checked;
  });
  const listvitrual = this.listNhomVatTu_.filter(c => c.checked === true);
  this.CheckLength = listvitrual.length;
}
CheckedList(checked) {
  const listvitrual = this.listNhomVatTu_.filter(c => c.checked === true);
  if (listvitrual.length === 1 || listvitrual.length === 0) {
    if (!checked === true) {
      this.CheckLength = 1;
    } else {
      this.CheckLength = 0;
    }
  }
  if (this.CheckLength ===  0) {
    this.checkall = false;
  }

}


// Tìm kiếm
// Phân trang
NextPage() {
  if (this.options.p < this.options.totalpage) {
  this.options.p++;
  this.R1GetListNhomVatTu();
  }
}

PrevPage() {
  if (this.options.p > 1) {
  this.options.p--;
  this.R1GetListNhomVatTu();
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
