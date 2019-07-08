import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SearchService } from '../../../shared/search.service';
import { UserInfoService } from '../../../shared/user-info.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router } from '@angular/router';
import { KehoachbaoduongService } from './kehoachbaoduong.service';
import { Kehoachbaoduong } from './kehoachbaoduong.model';
import * as $ from 'jquery';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { viLocale } from 'ngx-bootstrap/locale';
defineLocale('vi', viLocale);
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import { Subscription } from 'rxjs';
import {formatDate} from '@angular/common';
import { NhamayrootService } from '../../../shared/nhamayroot.service';
@Component({
  selector: 'app-kehoachbaoduong',
  templateUrl: './kehoachbaoduong.component.html',
  styleUrls: ['./kehoachbaoduong.component.scss']
})
export class KehoachbaoduongComponent implements OnInit, OnDestroy {
  isInShow: boolean;
  private sub: Subscription;
  locale = 'vi';
  locales = listLocales();
  date: Date = new Date();
  options = {
    s: '', p: 1, pz: 2000, totalpage: 0, total: 0, paxpz: 0, mathP: 0,
    _ThietbiID: '', Nam: this.date.getFullYear(), NhaMayID: null
  };
     // tìm kiếm
todos$ = this.s.$search;
  // list
listBaoDuongThietBi_: Kehoachbaoduong[];

  constructor(
    private spinnerService: Ng4LoadingSpinnerService ,
    private s: SearchService,
    private _userInfo: UserInfoService,
    private toastr: ToastrService,
    private  permissionsService: NgxPermissionsService,
    private kehoachbaoduongThietBiService_: KehoachbaoduongService,
    private router: Router,
    private datelageService: BsLocaleService,
    private nhaMaySevice_: NhamayrootService,
  ) {
    this.datelageService.use('vi');
    this.isInShow = false;
   }
listNam_: {Nam: number, NamString: string}[] =
[{Nam: 2019, NamString: 'Năm 2019'},
{Nam: 2020, NamString: 'Năm 2020'},
{Nam: 2021, NamString: 'Năm 2021'},
{Nam: 2022, NamString: 'Năm 2022'},
{Nam: 2023, NamString: 'Năm 2023'},
{Nam: 2024, NamString: 'Năm 2024'},
{Nam: 2025, NamString: 'Năm 2025'},
{Nam: 2026, NamString: 'Năm 2026'},
{Nam: 2027, NamString: 'Năm 2027'},
{Nam: 2028, NamString: 'Năm 2028'},
{Nam: 2029, NamString: 'Năm 2029'},
{Nam: 2030, NamString: 'Năm 2030'},
];
  // nhà máy
  nhaMayID$ = this.nhaMaySevice_.$nhaMayID;
  ngOnInit() {
    if (this.listNam_[this.listNam_.length - 1].Nam === this.date.getFullYear()) {
      for (let index = 1; index <= 10; index++) {
        this.listNam_.push({Nam: this.date.getFullYear() + index, NamString: `Năm ${this.date.getFullYear() + index}`});
      }
    }
    if (this._userInfo.user.IsAdmin === undefined) {
      this._userInfo.user.IsAdmin = false;
    }
    this.permissionsService.loadPermissions([`${this._userInfo.user.IsAdmin}`]);
    // tìm kiếm
    this.todos$.subscribe(res => {
      if (res === undefined || res === '') {
        this.options.s = '';
        this.r1GetListKeHoachBaoDuong();
      } else {
        this.options.s = res;
        this.r1GetListKeHoachBaoDuong();
      }
    });
    this.r1GetListKeHoachBaoDuong();
    this.nhaMayID$.subscribe(res => {
      if (res !== undefined) {
    this.r1GetListKeHoachBaoDuong();
      }
    });
  }
  r1GetListKeHoachBaoDuong() {
    this.options.NhaMayID = Number(localStorage.getItem('NhaMayID'));
    this.isInShow = false;
    this.spinnerService.show();
    this.kehoachbaoduongThietBiService_.r1GetListThietBiBaoDuongservice(this.options).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo lỗi');
          this.spinnerService.hide();
          return false;
        }
        const data = res['data'];
        if (data !== undefined) {
          this.spinnerService.hide();
          this.listBaoDuongThietBi_ = data;
        }
      }
    });
    }
    LuuThayDoi() {
      this.spinnerService.show();
      const nam_ = this.options.Nam;
      this.listBaoDuongThietBi_.forEach( function(item) {
        item.Nam = nam_;
      });
      const data = this.listBaoDuongThietBi_;
      for (let index = 0; index < data.length; index++) {
        if (data[index].TGDuKienBatDau !== null) {
          data[index].TGDuKienBatDau = formatDate(data[index].TGDuKienBatDau, 'yyyy-MM-ddTHH:mm:ssZZ ', 'en') as unknown as Date;
        }
        if (data[index].TGDuKienKetThuc !== null) {
        data[index].TGDuKienKetThuc = formatDate(data[index].TGDuKienKetThuc, 'yyyy-MM-ddTHH:mm:ssZZ', 'en') as unknown as Date;
        }
        if (data[index].TGThucTeBatDau !== null) {
          data[index].TGThucTeBatDau = formatDate(data[index].TGThucTeBatDau, 'yyyy-MM-ddTHH:mm:ssZZ', 'en') as unknown as Date;
        }
        if (data[index].TGThucTeKeThuc !== null) {
        data[index].TGThucTeKeThuc = formatDate(data[index].TGThucTeKeThuc, 'yyyy-MM-ddTHH:mm:ssZZ', 'en') as unknown as Date;
        }
      }
     this.kehoachbaoduongThietBiService_.r2SaveChangeKeHoachBaoDuong(data).subscribe(res => {
       if (res !== undefined) {
         if (res['error'] === 1) {
           this.toastr.error(res['ms'], 'Thông báo lỗi');
           this.spinnerService.hide();
           return  false;
         }
         this.r1GetListKeHoachBaoDuong();
         this.toastr.success('Lưu thay đổi bảng kế hoạch bảo dưỡng thành công', 'Thông báo');
       }
     });
    }
NamChanged() {
this.r1GetListKeHoachBaoDuong();
}
InBaoCao() {
  this.isInShow = true;
  setTimeout(() => {
    $('#btnprinthosokythuat').click();
   }, 50);
}
ngOnDestroy () {
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
}
