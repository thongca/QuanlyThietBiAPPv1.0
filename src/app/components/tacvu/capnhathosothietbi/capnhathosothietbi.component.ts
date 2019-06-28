import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Capnhathosothietbi } from './capnhathosothietbi.model';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SearchService } from '../../../shared/search.service';
import { UserInfoService } from '../../../shared/user-info.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { CapnhathosothietbiService } from './capnhathosothietbi.service';
import { Thietbi, Thongsokythuat } from '../../danhmuc/thietbi/thietbi';
import * as $ from 'jquery';
@Component({
  selector: 'app-capnhathosothietbi',
  templateUrl: './capnhathosothietbi.component.html',
  styleUrls: ['./capnhathosothietbi.component.scss']
})
export class CapnhathosothietbiComponent implements OnInit, OnDestroy {
  options = {
    s: '', p: 1, pz: 2000, totalpage: 0, total: 0, paxpz: 0, mathP: 0,
    _ThietbiID: ''
  };

private sub: Subscription;
 // modal
 @ViewChild('largeModal') public largeModal: ModalDirective;
 @ViewChild('warningModal') public warningModal: ModalDirective;
date = new Date();
   // tìm kiếm
todos$ = this.s.$search;

// string
modeltitle: string;
HoSoThietBiID: string;
TenThietBi: string;
ThietBiID: string;
CheckLength: number;
// list
listHoSoThietBi_: Capnhathosothietbi[];
listThietBi_: [
  {
    ThietBiID: string;
    TenThietBi: string;
  }
];
listBoPhan_: any[] = [
  {ID: 1, BoPhanSuDung: 'Xưởng sản xuất'},
];
listCaLamViec_: any[] = [
  {CaVanHanh: 1, CaVanHanh1: 'Ca 1'},
  {CaVanHanh: 2, CaVanHanh1: 'Ca 2'},
  {CaVanHanh: 3, CaVanHanh1: 'Ca 3'},
];
modelthietbi_: Thietbi;
litsthongsocoban_: Thongsokythuat[] = [];
// obj
modelHoSoThietBi_: Capnhathosothietbi;


  constructor(
    private spinnerService: Ng4LoadingSpinnerService ,
    private s: SearchService,
    private _userInfo: UserInfoService,
    private toastr: ToastrService,
    private  permissionsService: NgxPermissionsService,
    private hosoThietBiService_: CapnhathosothietbiService,
    private router: Router
  ) {
    this.ThietBiID = sessionStorage.getItem('ThietBiID');
   }

  ngOnInit() {
        // check permission admin
        let Permission = this._userInfo.r1GetobjPermission();
        if (Permission === undefined) {
          Permission = 'NoAdmin';
        } else {
          this.permissionsService.loadPermissions([`${Permission}`]);
        }
    // tìm kiếm
    this.todos$.subscribe(res => {
      if (res === undefined || res === '') {
        this.options.s = '';
        this.r1GetListHoSoThietBi();
      } else {
        this.options.s = res;
        this.r1GetListHoSoThietBi();
      }
    });
    this.modelHoSoThietBi_ = {
    HoSoThietBiID: '',
    NgayLapHoSo: this.date,
    ThietBiID: '',
    TinhTrangThietBi: '',
    BoPhanSuDung: '',
    NoiDungSuaChua: '',
    BaoDuong: false,
    KetQuaNghiemThu: '',
    NguoiThucHien: '',
    ThoiGianBatDau: null,
    ThoiGianKetThuc: null,
    CaVanHanh: 1,
    NguoiVanHanh: '',
    KetLuan: false,
    VatTuCanDung: ''
    };
    this.listThietBi_ = [{
      ThietBiID: '',
      TenThietBi: ''
    }];
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
    };
    this.r1GetListThietBi();
  }

  SetTotalPage() {
    this.options.totalpage = Math.ceil(this.options.total / this.options.pz);
    this.options.mathP = this.options.pz * this.options.p;
  }

r1GetListThietBi() {
this.hosoThietBiService_.r1GetListThietBiservice().subscribe(res => {
  if (res !== undefined) {
    if (res['error'] === 1) {
      this.toastr.error(res['ms'], 'Thông báo lỗi');
      return false;
    }
    const listThietBi = res['data'];
    if (this.listThietBi_.length > 0) {
      this.TenThietBi = listThietBi.filter(x => x.ThietBiID === this.ThietBiID)[0].TenThietBi;
    }
    this.options._ThietbiID = this.ThietBiID;
    if (this._userInfo.user.IsAdmin === false) {
      this.listThietBi_ = listThietBi.filter(x => x.ThietBiID === this.ThietBiID);
    } else {
      this.listThietBi_ = listThietBi;
    }
    this.r1GetListHoSoThietBi();
    this.r1GetListThongSoKyThuat();
  }
});
}
r1GetListThongSoKyThuat() {
  this.options._ThietbiID = this.ThietBiID;
  this.sub = this.hosoThietBiService_.r1GetThongSobyID(this.options).subscribe(res => {
    if (res !== undefined) {
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
     const data = res['data'];
     this.modelthietbi_ = res['datatb'];
     this.litsthongsocoban_  = data.filter(x => x.TSCoBan === true);
    }
  });
  }
r1GetListHoSoThietBi() {
  this.hosoThietBiService_.r1GetListHoSoThietBi(this.options).subscribe(res => {
    if (res !== undefined) {
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.listHoSoThietBi_ = res['data'];
      this.options.total = res['total'];
      this.SetTotalPage();
      if (this.options.p > 1) {
          this.options.paxpz = (this.options.p - 1) * this.options.pz;
      } else {
        this.options.paxpz = 0;
      }
    }
  });
  }
R2AdDataHoSo() {
  this.modelHoSoThietBi_.ThietBiID = this.ThietBiID;
  if (this.modelHoSoThietBi_.ThietBiID === ''
  || this.modelHoSoThietBi_.TinhTrangThietBi === ''
  || this.modelHoSoThietBi_.NoiDungSuaChua === ''
  || this.modelHoSoThietBi_.ThoiGianBatDau === null
  || this.modelHoSoThietBi_.NguoiThucHien === null
  || this.modelHoSoThietBi_.NguoiVanHanh === null
  ) {
    this.toastr.error('Vui lòng nhập thông tin vào cái trường có dấu *, Vui lòng thử lại!', 'Thông báo lỗi');
    return false;
  }
  if (this.modelHoSoThietBi_.HoSoThietBiID === '') {
  this.hosoThietBiService_.R2AddHoSoThietBi(this.modelHoSoThietBi_).subscribe(res => {
    if (res !== undefined) {
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.toastr.success('Thêm hồ sơ thiết bị thành công!', 'Thông báo');
      this.largeModal.hide();
      this.r1GetListHoSoThietBi();
    }
  });
} else {
  this.spinnerService.show();
    this.hosoThietBiService_.r3updateHoSoThietBi(this.HoSoThietBiID, this.modelHoSoThietBi_).subscribe(res => {
      this.spinnerService.hide();
        if (res !== undefined) {
          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          }
          this.toastr.success('Sửa hồ sơ thiết bị thành công!', 'Thông báo');
          this.r1GetListHoSoThietBi();
          this.largeModal.hide();
        }
    });
}

}
// modal
SelectIDEditModel(HoSoThietBiID: string) {
  this.modeltitle = 'Sửa hồ sơ thiết bị';
  this.HoSoThietBiID = HoSoThietBiID;
 this.sub =  this.hosoThietBiService_.r1GetHoSobyID(HoSoThietBiID).subscribe(res => {
    if (res !== undefined) {
      if (res['error']  === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
      }
     this.modelHoSoThietBi_ = res['data'];
    }
    this.largeModal.show();
  });
}

HideModal() {
  this.largeModal.hide();
  this.r1GetListHoSoThietBi();
}
  Showmodal(check) {
    if (check === 'add') {
      this.modeltitle = 'Thêm hồ sơ thiết bị';
      this.modelHoSoThietBi_ = {
        HoSoThietBiID: '',
        NgayLapHoSo: this.date,
        ThietBiID: this.modelHoSoThietBi_.ThietBiID,
        TinhTrangThietBi: '',
        BoPhanSuDung: 'Xưởng sản xuất',
        NoiDungSuaChua: '',
        BaoDuong: false,
        KetQuaNghiemThu: '',
        NguoiThucHien: '',
        ThoiGianBatDau: this.date,
        ThoiGianKetThuc: null,
        CaVanHanh: 1,
        NguoiVanHanh: '',
        KetLuan: false,
        VatTuCanDung: ''
        };
      this.largeModal.show();
    } else {
  }
  }
// change
ThietBiChanged() {
  this.r1GetListHoSoThietBi();
}
InBaoCao() {
  setTimeout(() => {
    $('#btnprinthosokythuat').click();
   }, 50);
}

// Tìm kiếm
// Phân trang
NextPage() {
  if (this.options.p < this.options.totalpage) {
  this.options.p++;
  this.r1GetListHoSoThietBi();
  }
}

PrevPage() {
  if (this.options.p > 1) {
  this.options.p--;
  this.r1GetListHoSoThietBi();
  }
}

// làm mới trang
refreshData() {
  this.options.s = '';
  this.s.SearchRoot(this.options.s);
  this.options.p = 1;
  this.toastr.success('Tải lại trang thành công', 'Thông báo');
}

  ngOnDestroy () {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
