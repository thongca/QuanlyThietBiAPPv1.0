import { ThietbirootService } from './../../../shared/thietbiroot.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SearchService } from '../../../shared/search.service';
import { UserInfoService } from '../../../shared/user-info.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router } from '@angular/router';
import { Baoduongdinhky } from './baoduongdinhky.model';
import { BaoduongdinhkyService } from './baoduongdinhky.service';
import { DatePipe } from '@angular/common';
import { KhuvucmayService } from '../../danhmuc/khuvucmay/khuvucmay.service';
import { Thietbi } from '../../danhmuc/thietbi/thietbi';
@Component({
  selector: 'app-baoduongdinhky',
  templateUrl: './baoduongdinhky.component.html',
  styleUrls: ['./baoduongdinhky.component.scss']
})
export class BaoduongdinhkyComponent implements OnInit, OnDestroy {
  sub: Subscription;
  date: Date = new Date();
  listbaoduongdinhky_: Baoduongdinhky[];
  options = {
    s: '', p: 1, pz: 2000, totalpage: 0, total: 0, paxpz: 0,
    mathP: 0, _ThietbiID: '', IsTime: this.date
  };
// list
listThietBi_: Thietbi[] = [];

  // number
  DayInsMonth: number;
  Active: boolean;
// string
ThietBiID: string;
MaThietBi: string;

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private s: SearchService,
    private _userInfo: UserInfoService,
    private toastr: ToastrService,
    private permissionsService: NgxPermissionsService,
    private router: Router,
    private baoduongdinhkyservice_: BaoduongdinhkyService,
   public datepipe: DatePipe,
   private khuvucmayservice_: KhuvucmayService,
   private thietbirootService_: ThietbirootService
  ) {
    this.options._ThietbiID = sessionStorage.getItem('ThietBiID');
   this.DayInsMonth =  this.baoduongdinhkyservice_.r1DayInsMonth(this.date);
   if (this.DayInsMonth === undefined) {
    this.DayInsMonth = 31;
   }
   this.Active = false;
   this.MaThietBi = sessionStorage.getItem('MaThietBi');
  }

  ngOnInit() {
    let Permission = this._userInfo.r1GetobjPermission();
      if (Permission === undefined) {
        Permission = 'NoAdmin';
      }
      this.permissionsService.loadPermissions([`${Permission}`]);
    this.R1GetListBaoDuongDinhKy();
    this.R1GetListThietBi();
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
        });
      }
  // danh sách bao dưởng định kỳ
  R1GetListBaoDuongDinhKy() {
    this.spinnerService.show();
    this.sub = this.baoduongdinhkyservice_.r1ListBaoDuongDinhKy(this.options).subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.listbaoduongdinhky_ = res['data'];
    });
  }
  r2LuuThayDoiBaoDuongDinhKy() {
    this.baoduongdinhkyservice_.r2LuuThayDoi(this.listbaoduongdinhky_).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo');
          return false;
        } else if (res['error'] === 0) {
          this.toastr.success('Lưu thay đổi bảng thành công!', 'Thông báo');
          this.R1GetListBaoDuongDinhKy();
        }
      }
    },
    err => {
      if (err.status === 404) {
        this.toastr.error('Lỗi khi xác nhận tài khoản, Vui lòng thử lại hoặc liên hệ quản trị viên!', 'Thông báo');
      }
      if (err.status === 500) {
        this.toastr.error('Mất kết nối đến máy chủ, Vui lòng thử lại hoặc liên hệ quản trị viên!', 'Thông báo');
      }
      if (err.status === 502) {
        this.toastr.error('Phần mềm đang được nâng cấp, Vui lòng chờ trong giây lát hoặc liên hệ quản trị viên!', 'Thông báo');
      }
    });
  }
  ChangeD(row: Baoduongdinhky, itemD: string, res: string) {
    if (itemD.toUpperCase() === 'D' || itemD.toUpperCase() === 'KD') {

    } else if (itemD !== '') {
      switch (res) {
        case 'D1':
          row.D1 = 'KD';
          break;
        case 'D2':
          row.D2 = 'KD';
          break;
        case 'D3':
          row.D3 = 'KD';
          break;
        case 'D4':
          row.D4 = 'KD';
          break;
        case 'D5':
          row.D5 = 'KD';
          break;
        case 'D6':
          row.D6 = 'KD';
          break;
        case 'D7':
          row.D7 = 'KD';
          break;
        case 'D8':
          row.D8 = 'KD';
          break;
        case 'D9':
          row.D9 = 'KD';
          break;
        case 'D10':
          row.D10 = 'KD';
          break;
        case 'D11':
          row.D11 = 'KD';
          break;
        case 'D12':
          row.D12 = 'KD';
          break;
        case 'D13':
          row.D13 = 'KD';
          break;
        case 'D14':
          row.D14 = 'KD';
          break;
        case 'D15':
          row.D15 = 'KD';
          break;
        case 'D16':
          row.D16 = 'KD';
          break;
        case 'D17':
          row.D17 = 'KD';
          break;
        case 'D18':
          row.D18 = 'KD';
          break;
        case 'D19':
          row.D19 = 'KD';
          break;
        case 'D20':
          row.D20 = 'KD';
          break;
        case 'D21':
          row.D21 = 'KD';
          break;
        case 'D22':
          row.D22 = 'KD';
          break;
        case 'D23':
          row.D23 = 'KD';
          break;
        case 'D24':
          row.D24 = 'KD';
          break;
        case 'D25':
          row.D25 = 'KD';
          break;
        case 'D26':
          row.D26 = 'KD';
          break;
        case 'D27':
          row.D27 = 'KD';
          break;
        case 'D28':
          row.D28 = 'KD';
          break;
        case 'D29':
          row.D29 = 'KD';
          break;
        case 'D30':
          row.D30 = 'KD';
          break;
        case 'D31':
          row.D31 = 'KD';
          break;
        default:
          break;
      }
    }
  }
  ChangeThang(IsTime) {
    const dateopt = this.datepipe.transform(IsTime, 'yyyy-MM-dd');
    this.options.IsTime = new Date(dateopt);
    this.R1GetListBaoDuongDinhKy();
  }
  ChangeThietBi() {
    sessionStorage.setItem('ThietBiID', this.options._ThietbiID);
    this.ThietBiID = this.options._ThietbiID;
    this.R1GetListBaoDuongDinhKy();
    this.thietbirootService_.r1getThietBiByID(this.options._ThietbiID).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo');
          return false;
        }
        const objThietBi = res['data'];
        sessionStorage.setItem('MaThietBi', objThietBi.MaThietBi);
        this.MaThietBi = objThietBi.MaThietBi;
      }
    },
    err => {
      if (err.status === 404) {
        this.toastr.error('Không có phàn hồi từ máy chủt', 'Thông báo');
      }
    });
  }
  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
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
