import { LMonth } from './../../danhmuc/khuvucmay/khuvucmay';
import { Thietbi } from './../../danhmuc/thietbi/thietbi';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SearchService } from '../../../shared/search.service';
import { UserInfoService } from '../../../shared/user-info.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { KhuvucmayService } from '../../danhmuc/khuvucmay/khuvucmay.service';
import { Chitietmay, Khuvucmay, ChiTietMayCheckListD, KhuVucPara, Thang } from '../../danhmuc/khuvucmay/khuvucmay';
import { BangchecklistdinhkyService } from './bangchecklistdinhky.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-bangchecklistdinhky',
  templateUrl: './bangchecklistdinhky.component.html',
  styleUrls: ['./bangchecklistdinhky.component.scss'],

})
export class BangchecklistdinhkyComponent implements OnInit, OnDestroy {
  // options
 date: Date;
  valueDate: string;
options = {
    s: '', p: 1, pz: 20, totalpage: 0, total: 0, paxpz: 0, mathP: 0, KhuVucID: '',
    _ThietbiID: '', IsTime: ''
  };
  // sub
sub: Subscription;
objThietBi: {
  TenThietBi: string;
  MaThietBi: string;
};
listchitietMay_: Chitietmay;
litsKhuVucMay_: Khuvucmay[] = [];
 listchitietCheckList_: ChiTietMayCheckListD[] = [];
selectedDate: any;
 _listKV: KhuVucPara[] = [];
 listMonth_: LMonth[] = [];
  // thang
 _listThang: Thang[] = [];
  // string
 ThietBiID: string;
KhuVucID: string;
// list
listThietBi_: Thietbi[] = [];
// bool
public Active: boolean;

  constructor(
    private router: Router,
    private s: SearchService,
    private _userInfo: UserInfoService,
    private toastr: ToastrService,
    private permissionsService: NgxPermissionsService,
    private spinnerService: Ng4LoadingSpinnerService,
    private khuvucmayservice_: KhuvucmayService,
    private bangcheckListdinhKyService_: BangchecklistdinhkyService
  ) {
    this.KhuVucID = '';
    this.date = new Date();
    this.ThietBiID = sessionStorage.getItem('ThietBiID');
    if (this.ThietBiID === null || this.ThietBiID === undefined) {
      this.router.navigateByUrl('/tacvu/danhsachthietbi');
      this.toastr.warning('Bạn chưa chọn thiết bị, vui lòng chọn thiết bị để tiếp tục!', 'Cảnh báo');
    }
    const thietbiID = sessionStorage.getItem('ThietBiID');
    this.options._ThietbiID = thietbiID;
    this.listchitietCheckList_ = [{
      KhuVucID: '',
      ThietBiID: '',
      ChiTietID: '',
      TenKhuVuc: '',
      children: [{
        KhuVucID: '',
        ChiTietID: '',
        Good: false,
        NeedRepair: false,
        Note: '',
        IsChange: false,
        CheckListDID: '',
        DateUpdateEndD: this.date
      }]
    }];
    this.objThietBi = {
      TenThietBi: '',
      MaThietBi: ''
    };
    this.Active = false;
  }

  ngOnInit() {
    if (this.date.getMonth() < 10) {
      this.options.IsTime = `${this.date.getFullYear()}-0${this.date.getMonth() + 1}`;
    } else {
      this.options.IsTime = `${this.date.getFullYear()}-${this.date.getMonth() + 1}`;
    }
    this.R1GetListChiTietMay();
    this.R1GetKhuVucMay();
    this.R1GetListThietBi();
  }

  Monthchanged() {
    this.R1GetListChiTietMay();
  }
  SetTotalPage() {
    this.options.totalpage = Math.ceil(this.options.total / this.options.pz);
    this.options.mathP = this.options.pz * this.options.p;
  }
  // danh sách khu vuc máy
  R1GetListChiTietMay() {
    this.spinnerService.show();
    this.sub = this.bangcheckListdinhKyService_.r1ListChiTietMay(this.options).subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      let Permission = this._userInfo.r1GetobjPermission();
      if (res['IsOld'] === true) {
        if (Permission === undefined) {
          Permission = 'NoAdmin';
        }
        this.permissionsService.loadPermissions([`${Permission}`]);
      } else {
        this.permissionsService.loadPermissions([`${Permission}`]);
      }
      const ThietBi_ = res['ThietBi'];
      this.objThietBi = ThietBi_[0];
      sessionStorage.setItem('MaThietBi', this.objThietBi.MaThietBi);
      this.listchitietCheckList_ = res['data'];
    });
  }
  // danh sách thiet bi
  R1GetListThietBi() {
    this.spinnerService.show();
    this.sub = this.khuvucmayservice_.r1Listthietbi().subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.listThietBi_ = res['data'];
      if (sessionStorage.getItem('ThietBiID') === null) {
        this.options._ThietbiID = this.listThietBi_[0].ThietBiID;
      }
      this.R1GetListChiTietMay();
    });
  }

  R1GetKhuVucMay() {
    this.options.pz = 20000;
    this.spinnerService.show();
    this.sub = this.khuvucmayservice_.r1ListKhuVuc(this.options).subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.litsKhuVucMay_ = res['data'];
    });
  }
  // change khu vực máy
  KhuVucMayhanged() {
    this.R1GetListChiTietMay();
  }
  changThang() {
    if (this.options.IsTime !== '') {
      this.R1GetListChiTietMay();
    }
  }
  ChangeThietBi() {
    sessionStorage.setItem('ThietBiID', this.options._ThietbiID);
    this.R1GetListChiTietMay();
    this.R1GetKhuVucMay();
  }
  //  bắt sự kiện thay đổi tình trạng chi tiết
  ChangeListChiTiet(ChiTietID: string, KhuVucID: string, checked) {
    this.listchitietCheckList_.filter(x => x.KhuVucID === KhuVucID)[0].children
    .filter(v => v.ChiTietID === ChiTietID).forEach(function (item) {
      if (item.ChiTietID === ChiTietID) {
        item.IsChange = true;
       if (checked !== '') {
        if (item.Good === false && item.NeedRepair === true && !checked === true) {
          item.NeedRepair = false;
        } else if (item.NeedRepair === false && item.Good === true && !checked === true) {
          item.Good = false;
        }
       }
      }
    });
  }

  // add khu vuc may +  chi tiet may
  R2AddCheckList() {
    const listChild_ = [];
    this.spinnerService.show();
    this.listchitietCheckList_.forEach(function (item) {
      item.children.forEach(function (c) {
        if (c.IsChange === true) {
          listChild_.push(c);
        }
      });
    });
    this.bangcheckListdinhKyService_.R2AddCheckListDinhKy(this.options.IsTime, this.ThietBiID, listChild_).subscribe(res => {
      this.spinnerService.hide();
      if (res !== undefined) {

        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo lỗi');
          return false;
        } else if (res['error'] === 2) {
          this.toastr.error(res['ms'], 'Thông báo lỗi');
          return false;
        } else {
          this.toastr.success('Lưu check list thành công thành công.', 'Thông báo');
          this.R1GetListChiTietMay();
        }
      }
    });
  }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  // làm mới trang
refreshData() {
  this.options.s = '';
  this.s.SearchRoot(this.options.s);
  this.options.p = 1;
  this.toastr.success('Tải lại trang thành công', 'Thông báo');
  this.ngOnInit();
}
Event(e) {
  if (e.target.closest('.select-tieuchi') === null) {
    this.Active = false;
  }
}
}
