import { DonvitinhService } from './donvitinh.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { UserInfoService } from '../../../shared/user-info.service';
// import searchroot
import { SearchService } from '../../../shared/search.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-donvitinh',
  templateUrl: './donvitinh.component.html',
  styleUrls: ['./donvitinh.component.scss']
})
export class DonvitinhComponent implements OnInit, OnDestroy {
 options = {s: '', p: 1, pz: 20, totalpage: 0, total: 0, paxpz: 0, mathP: 0};

  // subscript
  private subscription: Subscription;
  private subscription1: Subscription;
  private subscription2: Subscription;

  // modal
  @ViewChild('largeModal') public largeModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;

  // tìm kiếm
  todos$ = this.s.$search;
  checkall: boolean;
  // string
  public modeltitle: string;
  CheckLength: number;
  DonViTinhID: string;
  errormodal: string;
  // obj
  modeldonvitinh_: {
    DonViTinhID: string;
    TenDonVi: string;
  };

  // list
  listDonViTinh_: {
    DonViTinhID: string;
    TenDonVi: string;
    checked: boolean
  }[];

  constructor(
      private spinnerService: Ng4LoadingSpinnerService ,
     private s: SearchService,
     private _userInfo: UserInfoService,
     private toastr: ToastrService,
     private  permissionsService: NgxPermissionsService,
     private donviservice_: DonvitinhService
  ) { }

  ngOnInit() {
    this.modeldonvitinh_ = {
      DonViTinhID: '',
      TenDonVi: ''
    };
        // check permission admin
        let Permission = this._userInfo.r1GetobjPermission();
        if (Permission === undefined) {
          Permission = 'NoAdmin';
        }
        this.permissionsService.loadPermissions([`${Permission}`]);

    // tìm kiếm
   this.subscription2 = this.todos$.subscribe(res => {
      if (res === undefined || res === '') {
        this.options.s = '';
        this.R1GetListDonViTinh();
      } else {
        this.options.s = res;
        this.R1GetListDonViTinh();
      }
    });

  }
  SetTotalPage() {
    this.options.totalpage = Math.ceil(this.options.total / this.options.pz);
    this.options.mathP = this.options.pz * this.options.p;
}
// danh sách đơn vị tính
R1GetListDonViTinh() {
  this.spinnerService.show();
   this.subscription = this.donviservice_.r1ListDonViTinh(this.options).subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.listDonViTinh_ = res['data'];
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
    this.modeltitle = 'Thêm mới đơn vị tính';
    // tslint:disable-next-line:max-line-length
    this.modeldonvitinh_ = {DonViTinhID: '', TenDonVi: ''};
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


// thêm mới, sửa đơn vị tính
R2AdDataNhomNguoiDung(): boolean {
  if (this.modeldonvitinh_.TenDonVi === '') {
  this.toastr.warning('Vui lòng nhập thông tin vào các trường có dấu (*)', 'Cảnh báo');
    return false;
  }
  if (this.modeldonvitinh_.DonViTinhID === '' || this.modeldonvitinh_.DonViTinhID === null) {
    this.spinnerService.show();
    this.donviservice_.R2AddDonViTinh(this.modeldonvitinh_).subscribe(res => {
      this.spinnerService.hide();
      if (res !== undefined) {

          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          } else {
            this.toastr.success('Thêm mới đơn vị tính thành công.', 'Thông báo');
            this.R1GetListDonViTinh();
            this.largeModal.hide();
          }
      }
    });
  } else {
    this.spinnerService.show();
    this.donviservice_.r3updateDonViTinh(this.DonViTinhID, this.modeldonvitinh_).subscribe(res => {
      this.spinnerService.hide();
        if (res !== undefined) {
          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          }
          this.toastr.success('Sửa đơn vị tính thành công!', 'Thông báo');
          this.R1GetListDonViTinh();
          this.largeModal.hide();
        }
    });
  }

}
// modal
SelectIDEditModel(DonViTinhID: string) {
  this.modeltitle = 'Sửa đơn vị tính';
  this.DonViTinhID = DonViTinhID;
 this.subscription1 =  this.donviservice_.r1GetDVTbyID(DonViTinhID).subscribe(res => {
    if (res !== undefined) {
      if (res['error']  === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
     this.modeldonvitinh_ = res['data'];
    }
    this.largeModal.show();
  });
}

HideModal() {
  this.largeModal.hide();
  this.R1GetListDonViTinh();
}


xacnhanXoa(rowto) {
  if (this.CheckLength > 0) {
    this.r4DelDonViTinh(rowto);
  }
}
r4DelDonViTinh(rowto) {
 const arr = [
  ];
  rowto.forEach(function (item) {
    if (item.checked) {
      const obj = {DonViTinhID: item.DonViTinhID};
     arr.push(obj);
    }
});
  this.donviservice_.r4deleteDonViTinh(arr).subscribe(res => {
    if (res !== undefined) {
      if (res['error'] === 1) {
      this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.warningModal.hide();
      this.toastr.success('Xóa thành công đơn vị tính', 'Thông báo');
      this.CheckLength = 0;
      this.R1GetListDonViTinh();
    }
  });
}

// checked
toggleAll (rowto, checked) {
  this.CheckLength = 0;
  rowto.forEach(function (value, key) {
      rowto[key].checked = !checked;
  });
  const listvitrual = this.listDonViTinh_.filter(c => c.checked === true);
  this.CheckLength = listvitrual.length;
}
CheckedList(checked) {
  const listvitrual = this.listDonViTinh_.filter(c => c.checked === true);
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
  this.R1GetListDonViTinh();
  }
}

PrevPage() {
  if (this.options.p > 1) {
  this.options.p--;
  this.R1GetListDonViTinh();
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
