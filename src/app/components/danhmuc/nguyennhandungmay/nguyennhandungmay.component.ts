import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SearchService } from '../../../shared/search.service';
import { UserInfoService } from '../../../shared/user-info.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { DonvitinhService } from '../donvitinh/donvitinh.service';
import { Nguyennhandungmay } from './nguyennhandungmay.model';
import { NguyennhandungmayService } from './nguyennhandungmay.service';

@Component({
  selector: 'app-nguyennhandungmay',
  templateUrl: './nguyennhandungmay.component.html',
  styleUrls: ['./nguyennhandungmay.component.scss']
})
export class NguyennhandungmayComponent implements OnInit, OnDestroy {

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
  NguyenNhanID: string;
  errormodal: string;
  // obj
  modelnguyennhan_: Nguyennhandungmay;

  // list
  listNguyenNhan_: Nguyennhandungmay[];

  constructor(
      private spinnerService: Ng4LoadingSpinnerService ,
     private s: SearchService,
     private _userInfo: UserInfoService,
     private toastr: ToastrService,
     private  permissionsService: NgxPermissionsService,
     private donviservice_: DonvitinhService,
     private nguyennhanservice_: NguyennhandungmayService
  ) { }

  ngOnInit() {
    this.modelnguyennhan_ = {
      NguyenNhanID: '',
      TenNguyenNhan: '',
      ThuTu: 0,
      checked:  false,
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
        this.R1GetListNguyenNhan();
      } else {
        this.options.s = res;
        this.R1GetListNguyenNhan();
      }
    });

  }
  SetTotalPage() {
    this.options.totalpage = Math.ceil(this.options.total / this.options.pz);
    this.options.mathP = this.options.pz * this.options.p;
}
// danh sách nguyên nhân
R1GetListNguyenNhan() {
  this.spinnerService.show();
   this.subscription = this.nguyennhanservice_.r1ListNguyenNhan(this.options).subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.listNguyenNhan_ = res['data'];
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
    this.modeltitle = 'Thêm mới nguyên nhân';
    // tslint:disable-next-line:max-line-length
    this.modelnguyennhan_ = {NguyenNhanID: '', TenNguyenNhan: '', ThuTu: 0, checked : false};
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
R2AdDataNguyenNhan(): boolean {
  if (this.modelnguyennhan_.TenNguyenNhan === '') {
  this.toastr.warning('Vui lòng nhập thông tin vào các trường có dấu (*)', 'Cảnh báo');
    return false;
  }
  if (this.modelnguyennhan_.NguyenNhanID === '' || this.modelnguyennhan_.NguyenNhanID === null) {
    this.spinnerService.show();
    this.nguyennhanservice_.R2AddNguyenNhan(this.modelnguyennhan_).subscribe(res => {
      this.spinnerService.hide();
      if (res !== undefined) {

          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          } else {
            this.toastr.success('Thêm mới thông tin danh mục nguyên nhân dừng máy thành công.', 'Thông báo');
            this.R1GetListNguyenNhan();
            this.largeModal.hide();
          }
      }
    });
  } else {
    this.spinnerService.show();
    this.nguyennhanservice_.r3updateNguyenNhan(this.NguyenNhanID, this.modelnguyennhan_).subscribe(res => {
      this.spinnerService.hide();
        if (res !== undefined) {
          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          }
          this.toastr.success('Sửa thông tin danh mục nguyên nhân dừng máy thành công!', 'Thông báo');
          this.R1GetListNguyenNhan();
          this.largeModal.hide();
        }
    });
  }

}
// modal
SelectIDEditModel(NguyenNhanID: string) {
  this.modeltitle = 'Sửa nguyên nhân';
  this.NguyenNhanID = NguyenNhanID;
 this.subscription1 =  this.nguyennhanservice_.r1GetNNbyID(NguyenNhanID).subscribe(res => {
    if (res !== undefined) {
      if (res['error']  === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
     this.modelnguyennhan_ = res['data'];
    }
    this.largeModal.show();
  });
}

HideModal() {
  this.largeModal.hide();
  this.R1GetListNguyenNhan();
}


xacnhanXoa(rowto) {
  if (this.CheckLength > 0) {
    this.r4DelNguyenNhan(rowto);
  }
}
r4DelNguyenNhan(rowto) {
 const arr = [
  ];
  rowto.forEach(function (item) {
    if (item.checked) {
      const obj = {NguyenNhanID: item.NguyenNhanID};
     arr.push(obj);
    }
});
  this.nguyennhanservice_.r4deleteNguyenNhan(arr).subscribe(res => {
    if (res !== undefined) {
      if (res['error'] === 1) {
      this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.warningModal.hide();
      this.toastr.success('Xóa thành công thông tin danh mục nguyên nhân dừng máy', 'Thông báo');
      this.CheckLength = 0;
      this.R1GetListNguyenNhan();
    }
  });
}

// checked
toggleAll (rowto, checked) {
  this.CheckLength = 0;
  rowto.forEach(function (value, key) {
      rowto[key].checked = !checked;
  });
  const listvitrual = this.listNguyenNhan_.filter(c => c.checked === true);
  this.CheckLength = listvitrual.length;
}
CheckedList(checked) {
  const listvitrual = this.listNguyenNhan_.filter(c => c.checked === true);
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
  this.R1GetListNguyenNhan();
  }
}

PrevPage() {
  if (this.options.p > 1) {
  this.options.p--;
  this.R1GetListNguyenNhan();
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
