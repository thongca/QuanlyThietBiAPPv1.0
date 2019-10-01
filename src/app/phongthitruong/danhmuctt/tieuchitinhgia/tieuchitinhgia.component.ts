import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SearchService } from '../../../shared/search.service';
import { UserInfoService } from '../../../shared/user-info.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { NhamayrootService } from '../../../shared/nhamayroot.service';
import { TieuchitinhgiaService } from './tieuchitinhgia.service';
import { Subscription } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap';
import { Tieuchitinhgia } from './tieuchitinhgia.model';
import { CachtinhService } from '../cachtinhdongia/cachtinh.service';
import { Cachtinhdongia } from '../cachtinhdongia/cachtinhdongia.model';

@Component({
  selector: 'app-tieuchitinhgia',
  templateUrl: './tieuchitinhgia.component.html',
  styleUrls: ['./tieuchitinhgia.component.scss']
})
export class TieuchitinhgiaComponent implements OnInit, OnDestroy {

  options = { s: '', p: 1, pz: 20, totalpage: 0, total: 0, paxpz: 0, mathP: 0, NhaMayID: 1 };

  // subscript
  private subscription: Subscription;
  private subscription1: Subscription;
  private subscription2: Subscription;

  // modal
  @ViewChild('largeModal') public largeModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;


  checkall: boolean;
  // string
  public modeltitle: string;
  CheckLength: number;
  TieuChiID: string;
  errormodal: string;
  // obj
  modelTieuChiTinhGia_: Tieuchitinhgia;
  // list
  listDonViTinh_: Cachtinhdongia[];
  // list
  listTieuChiTinhGia_: Tieuchitinhgia[];
  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private s: SearchService,
    private _userInfo: UserInfoService,
    private toastr: ToastrService,
    private permissionsService: NgxPermissionsService,
    private tieuchitinhgiaservice_: TieuchitinhgiaService,
    private nhaMaySevice_: NhamayrootService,
    private donviservice_: CachtinhService,
  ) {
    this.R1GetListDonViTinh();
    this.modelTieuChiTinhGia_ = {
      TieuChiID: '',
      TenTieuChi: '',
      TenDonVi: '',
      CongMin: 0,
      CongMax: 0,
      DonViID: '',
      ThuTu: 0,
      IsActive: true,
      GhiChu: '',
      NhaMayID: 0,
      checked: false,
      CongThuc: '',
      GiaMax: 0,
      GiaMin: 0,
      TieuChiSPID: '',
      GiaSan: 0
    };
  }
  // tìm kiếm
  todos$ = this.s.$search;
  // nhà máy
  nhaMayID$ = this.nhaMaySevice_.$nhaMayID;
  ngOnInit() {
    let Permission = this._userInfo.r1GetobjPermission();
    if (Permission === undefined) {
      Permission = 'NoAdmin';
    }
    this.permissionsService.loadPermissions([`${Permission}`]);

    // tìm kiếm
    this.subscription2 = this.todos$.subscribe(res => {
      if (res === undefined || res === '') {
        this.options.s = '';
        this.R1GetListTCTC();
      } else {
        this.options.s = res;
        this.R1GetListTCTC();
      }
    });
    this.nhaMayID$.subscribe(res => {
      if (res !== undefined) {
        this.R1GetListTCTC();
      }
    });
  }
  // tính tông trang
  SetTotalPage() {
    this.options.totalpage = Math.ceil(this.options.total / this.options.pz);
    this.options.mathP = this.options.pz * this.options.p;
  }
  // danh sách đơn vị tính
  R1GetListTCTC() {
    this.options.NhaMayID = Number(localStorage.getItem('NhaMayID'));
    this.spinnerService.show();
    this.subscription = this.tieuchitinhgiaservice_.r1ListTT_DM_TCTC(this.options).subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.listTieuChiTinhGia_ = res['data'];
      this.options.total = res['total'];
      this.SetTotalPage();
      if (this.options.p > 1) {
        this.options.paxpz = (this.options.p - 1) * this.options.pz;
      } else {
        this.options.paxpz = 0;
      }
    },
      err => {
        if (err.status === 500) {
          this.toastr.error('Mất kết nối đến máy chủ. Vui lòng kiểm tra lại đường dẫn.', 'Thông báo');
          return false;
        }
      });
  }
  // danh sách đơn vị tính
  R1GetListDonViTinh() {
    this.options.pz = 20000;
    this.options.NhaMayID = Number(localStorage.getItem('NhaMayID'));
    this.spinnerService.show();
    this.subscription = this.donviservice_.r1ListTT_DM_DVT(this.options).subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.listDonViTinh_ = res['data'];
    },
      err => {
        if (err.status === 500) {
          this.toastr.error('Mất kết nối đến máy chủ. Vui lòng kiểm tra lại đường dẫn.', 'Thông báo');
          return false;
        }
      });
  }
  Showmodal(check) {
    if (check === 'add') {
      this.modeltitle = 'Thêm mới tiêu chí tính giá';
      // tslint:disable-next-line:max-line-length
      this.modelTieuChiTinhGia_ = {
        TieuChiID: '',
        TenTieuChi: '',
        TenDonVi: '',
        CongMin: 0,
        CongMax: 0,
        DonViID: '',
        ThuTu: this.options.total + 1,
        IsActive: true,
        GhiChu: '',
        NhaMayID: 0,
        checked: false,
        CongThuc: '',
        GiaMax: 0,
        GiaMin: 0,
        TieuChiSPID: '',
        GiaSan: 0
      };
      this.largeModal.show();
    } else {
    }
  }

// thêm mới, sửa đơn vị tính
R2AdDataDTieuChiTinhGia(): boolean {
  this.modelTieuChiTinhGia_.NhaMayID = Number(localStorage.getItem('NhaMayID'));
  if (this.modelTieuChiTinhGia_.TenTieuChi === '' || this.modelTieuChiTinhGia_.CongMax === 0 || this.modelTieuChiTinhGia_.CongMin === 0) {
  this.toastr.warning('Vui lòng nhập thông tin vào các trường có dấu (*)', 'Cảnh báo');
    return false;
  }
  if (this.modelTieuChiTinhGia_.TieuChiID === '' || this.modelTieuChiTinhGia_.TieuChiID === null) {
    this.spinnerService.show();
    this.tieuchitinhgiaservice_.R2AddTieuChiTinhGia(this.modelTieuChiTinhGia_).subscribe(res => {
      this.spinnerService.hide();
      if (res !== undefined) {

          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          } else {
            this.toastr.success('Thêm mới tiêu chí tính giá thành công.', 'Thông báo');
            this.R1GetListTCTC();
            this.largeModal.hide();
          }
      }
    }, err => {
      if (err.status === 500) {
        this.toastr.error('Mất kết nối đến máy chủ. Vui lòng kiểm tra lại đường dẫn', 'Thông báo');
        return false;
      }
    });
  } else {
    this.spinnerService.show();
    this.tieuchitinhgiaservice_.r3updateTCTG(this.TieuChiID, this.modelTieuChiTinhGia_).subscribe(res => {
      this.spinnerService.hide();
        if (res !== undefined) {
          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          }
          this.toastr.success('Sửa tiêu chí tính giá thành công!', 'Thông báo');
          this.R1GetListTCTC();
          this.largeModal.hide();
        }
    }, err => {
      if (err.status === 500) {
        this.toastr.error('Mất kết nối đến máy chủ. Vui lòng kiểm tra lại đường dẫn', 'Thông báo');
        return false;
      }
      if (err.status === 400) {
        this.toastr.error('Không có phản hồi từ máy chủ. Vui lòng kiểm tra lại đường dẫn', 'Thông báo');
        return false;
      }
    });
  }
}
// modal
SelectIDEditModel(TieuChiID: string) {
  this.modeltitle = 'Sửa tiêu chí tính giá';
  this.TieuChiID = TieuChiID;
 this.subscription1 =  this.tieuchitinhgiaservice_.r1GetTCTGbyID(TieuChiID).subscribe(res => {
    if (res !== undefined) {
      if (res['error']  === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
     this.modelTieuChiTinhGia_ = res['data'];
    }
    this.largeModal.show();
  });
}

HideModal() {
  this.largeModal.hide();
  this.R1GetListTCTC();
}

xacnhanXoa(rowto) {
  if (this.CheckLength > 0) {
    this.r4DelTieuChiDanhGia(rowto);
  }
}
r4DelTieuChiDanhGia(rowto) {
 const arr = [
  ];
  rowto.forEach(function (item) {
    if (item.checked) {
      const obj = {TieuChiID: item.TieuChiID};
     arr.push(obj);
    }
});
  this.tieuchitinhgiaservice_.r4deleteTCTG(arr).subscribe(res => {
    if (res !== undefined) {
      if (res['error'] === 1) {
      this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.warningModal.hide();
      this.toastr.success('Xóa thành công đơn vị tính', 'Thông báo');
      this.CheckLength = 0;
      this.R1GetListTCTC();
    }
  });
}

// checked
toggleAll (rowto, checked) {
  this.CheckLength = 0;
  rowto.forEach(function (value, key) {
      rowto[key].checked = !checked;
  });
  const listvitrual = this.listTieuChiTinhGia_.filter(c => c.checked === true);
  this.CheckLength = listvitrual.length;
}
CheckedList(checked) {
  const listvitrual = this.listTieuChiTinhGia_.filter(c => c.checked === true);
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
  this.R1GetListTCTC();
  }
}

PrevPage() {
  if (this.options.p > 1) {
  this.options.p--;
  this.R1GetListTCTC();
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
