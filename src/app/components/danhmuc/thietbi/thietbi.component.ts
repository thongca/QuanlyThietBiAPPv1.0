import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SearchService } from '../../../shared/search.service';
import { UserInfoService } from '../../../shared/user-info.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { ThietbiService } from './thietbi.service';
import { Thongsokythuat, Thietbi, ThietbiDM } from './thietbi';
import * as $ from 'jquery';
@Component({
  selector: 'app-thietbi',
  templateUrl: './thietbi.component.html',
  styleUrls: ['./thietbi.component.scss']
})
export class ThietbiComponent implements OnInit, OnDestroy {
 options = {s: '', p: 1, pz: 20, totalpage: 0, total: 0, paxpz: 0, mathP: 0, NhaMayID: null};

  // subscript
  private subscription: Subscription;
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;
  // model
litsthongsokythuat_: Thongsokythuat[] = [];
litsthongsocoban_: Thongsokythuat[] = [];
litsthongsochitiet_: Thongsokythuat[] = [];
modelthongsokythuat_: Thongsokythuat;
checkall: boolean;
modelthietbi_: ThietbiDM;
listthietbi_: ThietbiDM[];
errormodal: string;
  // modal
  @ViewChild('largeModal') public largeModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;

  // tìm kiếm
  todos$ = this.s.$search;

  // string
  public modeltitle: string;
  CheckLength: number;
  ThietBiID: string;

  // list
  listNhomThietBi_: {}[];
  listDonViTinh_: {}[];
  listNhaMay_: {
    NhaMayID: number;
    TenNhaMay: string;
  }[];

  constructor(
     private spinnerService: Ng4LoadingSpinnerService ,
     private s: SearchService,
     private _userInfo: UserInfoService,
     private toastr: ToastrService,
     private  permissionsService: NgxPermissionsService,
    private thietbiservice_: ThietbiService
  ) { }

  ngOnInit() {
    this.modelthietbi_ = {
      ThietBiID: '',
      MaThietBi: '',
      TenThietBi: '',
      XuatXu: '',
      NamSanXuat: new Date,
      NhomThietBiID: '',
      DonViTinhID: '',
      GhiChu: '',
      ThuTu: 0,
      IsActive: true,
      checked: false,
      TenNhom: '',
      TenDonVi: '',
      NgayLapHSo: new Date,
      NhaMayID: null,
    };
    this.modelthongsokythuat_ = {
      ThongSoKTID: '',
      ThietBiID: '',
      TenThongSo: '',
      SoLieu: '',
      ThuTu: 0,
      GhiChu: '',
      TSCoBan : false,
      IsSelect: false,
      IsChange: false,
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
        this.R1GetListThietBi();
      } else {
        this.options.s = res;
        this.R1GetListThietBi();
      }
    });
    this.r1GetListNhomTB();
    this.r1GetListNDonViTinh();
    this.R1DanhSachNhaMay();
  }
  SetTotalPage() {
    this.options.totalpage = Math.ceil(this.options.total / this.options.pz);
    this.options.mathP = this.options.pz * this.options.p;
}

// danh sách nhà máy
R1DanhSachNhaMay() {
  this.thietbiservice_.r1GetNhaMay().subscribe(res => {
    if (res !== undefined) {
      if (res['error'] === 1) {
        return false;
      }
      const data = res['data'];
      if (data !== undefined) {
        this.listNhaMay_ = data;
        this.options.NhaMayID = this.listNhaMay_[0].NhaMayID;
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
// danh sách nhóm thiết bị
r1GetListNhomTB() {
 this.subscription2 = this.thietbiservice_.r1Listnhomthietbi().subscribe(res => {
      if (res !== undefined) {
        this.listNhomThietBi_ = res['data'];
      }
    });
}

// danh sách đơn vị tính
r1GetListNDonViTinh() {
  this.subscription3 = this.thietbiservice_.r1Listdonvitinh().subscribe(res => {
       if (res !== undefined) {
         this.listDonViTinh_ = res['data'];
       }
     });
 }
// danh sách thiet bi
R1GetListThietBi() {
  this.spinnerService.show();
   this.subscription = this.thietbiservice_.r1ListThietBi(this.options).subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.listthietbi_ = res['data'];
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
    this.modeltitle = 'Thêm mới thiết bị';
    this.modelthietbi_ = {
      ThietBiID: '',
      MaThietBi: '',
      TenThietBi: '',
      XuatXu: '',
      NamSanXuat: new Date,
      NhomThietBiID: '',
      DonViTinhID: '',
      GhiChu: '',
      ThuTu: 0,
      IsActive: true,
      checked: false,
      TenDonVi: '',
      TenNhom: '',
      NgayLapHSo: new Date,
      NhaMayID: 1,
    };
    this.litsthongsokythuat_ = [];
this.modelthongsokythuat_ = {
  ThongSoKTID: '',
  ThietBiID: '',
  TenThongSo: '',
  SoLieu: '',
  ThuTu: 0,
  GhiChu: '',
  TSCoBan: false,
  IsSelect: false,
  IsChange: false,
};

    this.largeModal.show();
  } else {
}
}
// modal
modalUserInGroup(DonViTinhID) {
// this.thietbiservice_.r1GetnhomTBbyID(DonViTinhID).subscribe(res => {
//   if (res['error'] === 1) {
//     this.toastr.error(res['ms'], 'Thông báo lỗi');
//     return false;
//   }
// });
}
// thêm thông số kỹ thuật
AddThongSo() {
  if (this.modelthongsokythuat_.TenThongSo === '' || this.modelthongsokythuat_.SoLieu === '') {
    this.toastr.warning('Vui lòng nhập tên thông số kỹ thuật hoặc nhập số liệu tương ứng.', 'Cảnh báo');
    return false;
  }
  this.litsthongsokythuat_.push(this.modelthongsokythuat_);
  this.modelthongsokythuat_ = {
    ThongSoKTID: '',
    ThietBiID: '',
    TenThongSo: '',
    SoLieu: '',
    ThuTu: 0,
    GhiChu: '',
    TSCoBan: this.modelthongsokythuat_.TSCoBan,
    IsSelect: false,
    IsChange: true,
  };
}

// thêm mới, sửa đơn vị tính
R2AdDataThietBi(): boolean {
  if (this.modelthietbi_.MaThietBi === ''
  || this.modelthietbi_.TenThietBi === '') {
  this.toastr.warning('Vui lòng nhập thông tin vào các trường có dấu (*)', 'Cảnh báo');
    return false;
  }
  this.modelthietbi_.NhaMayID = this.options.NhaMayID;
  if (this.modelthietbi_.ThietBiID === '' || this.modelthietbi_.DonViTinhID === null) {
    this.spinnerService.show();
    this.thietbiservice_.R2AddThietBiThongSo(this.modelthietbi_, this.litsthongsokythuat_).subscribe(res => {
      this.spinnerService.hide();
      if (res !== undefined) {

          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          } else if (res['error'] === 2) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          } else {
            this.toastr.success('Thêm mới thiết bị thành công.', 'Thông báo');
            this.R1GetListThietBi();
            this.largeModal.hide();
          }
      }
    });
  } else {
    this.spinnerService.show();
    this.thietbiservice_.r3updateThietBi(
      this.ThietBiID,
      this.modelthietbi_,
       this.litsthongsokythuat_.filter(x => x.IsChange === true))
       .subscribe(res => {
      this.spinnerService.hide();
        if (res !== undefined) {
          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          }
          if (res['error'] === 2) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          }
          this.toastr.success('Sửa thông tin thiết bị thành công!', 'Thông báo');
          this.R1GetListThietBi();
          this.largeModal.hide();
        }
    });
  }

}
// modal
SelectIDEditModel(ThietBiID: string) {
  this.modeltitle = 'Sửa thiết bị';
  this.ThietBiID = ThietBiID;
 this.subscription1 =  this.thietbiservice_.r1GetThietbibyID(ThietBiID).subscribe(res => {
    if (res !== undefined) {
      if (res['error']  === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
      }
     this.modelthietbi_ = res['datatb'];
     this.litsthongsokythuat_ = res['dataTs'];
    }
    this.largeModal.show();
  });
}
PrintReport(ThietBiID: string) {
  this.modeltitle = 'Sửa thiết bị';
  this.ThietBiID = ThietBiID;
 this.subscription1 =  this.thietbiservice_.r1GetThietbibyID(ThietBiID).subscribe(res => {
    if (res !== undefined) {
      if (res['error']  === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
      }
     this.modelthietbi_ = res['datatb'];
     this.litsthongsokythuat_ = res['dataTs'];
     this.litsthongsocoban_ = this.litsthongsokythuat_.filter(x => x.TSCoBan === true);
     this.litsthongsochitiet_ = this.litsthongsokythuat_.filter(x => x.TSCoBan === false);
     this.spinnerService.show();
     setTimeout(() => {
      $('#btnprint').click();
      this.spinnerService.hide();
     }, 1000);

    }
  });
}

UpdateThongSo(ThongSoID) {
  this.modeltitle = 'Sửa thiết bị';
 this.subscription1 =  this.thietbiservice_.r1GetThongSobyID(ThongSoID, this.ThietBiID).subscribe(res => {
    if (res !== undefined) {
      if (res['error']  === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
      }
     this.modelthongsokythuat_ = res['dataTs'];
    }
  });
}
ChangeNhaMay() {
this.R1GetListThietBi();
}
HideModal() {
  this.largeModal.hide();
  this.R1GetListThietBi();
}


xacnhanXoa(rowto) {
  if (this.CheckLength > 0) {
    this.r4DelThietBi(rowto);
  }
}
r4DelThietBi(rowto) {
 const arr = [];
  rowto.forEach(function (item) {
    if (item.checked) {
      const obj = {ThietBiID: item.ThietBiID};
     arr.push(obj);
    }
});
  this.thietbiservice_.r4deleteThietBi(arr).subscribe(res => {
    if (res !== undefined) {
      if (res['error'] === 1) {
      this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.warningModal.hide();
      this.toastr.success('Xóa thành công thiết bị', 'Thông báo');
      this.CheckLength = 0;
      this.R1GetListThietBi();
    }
  });
}
// select row
selectRowTS (ThongSoKTID) {
  if (this.litsthongsokythuat_ !== undefined) {
   this.litsthongsokythuat_.forEach(function(item) {
    if (item.ThongSoKTID === ThongSoKTID) {
      item.IsSelect = true;
      item.IsChange = true;
    } else {
      item.IsSelect = false;
    }
   });
  }
}

XoaRowThongSo(index, ID) {
this.subscription4 =  this.thietbiservice_.r4deleteChitiet(ID).subscribe(res => {
  if (res['error'] === 1) {
    this.toastr.error(res['ms'], 'Thông báo lỗi');
    return false;
  }
  this.litsthongsokythuat_.splice(index, 1);
  this.toastr.success('Xóa thành công chi tiết máy', 'Thông báo');
});
}
// checked
toggleAll (rowto, checked) {
  this.CheckLength = 0;
  rowto.forEach(function (value, key) {
      rowto[key].checked = !checked;
  });
  const listvitrual = this.listthietbi_.filter(c => c.checked === true);
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
  this.R1GetListThietBi();
  }
}

PrevPage() {
  if (this.options.p > 1) {
  this.options.p--;
  this.R1GetListThietBi();
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
  if (this.subscription3) {
    this.subscription3.unsubscribe();
  }
  if (this.subscription4) {
    this.subscription4.unsubscribe();
  }
}


}
