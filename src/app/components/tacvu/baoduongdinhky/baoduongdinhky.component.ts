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
import { ThietbiService } from '../../danhmuc/thietbi/thietbi.service';
import { NhamayrootService } from '../../../shared/nhamayroot.service';
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
    mathP: 0, _ThietbiID: '', IsTime: this.date, NhaMayID: null
  };
  // list
  listThietBi_: Thietbi[] = [];
  // number
  DayInsMonth: number;
  Active: boolean;
  // string
  ThietBiID: string;
  MaThietBi: string;
// Nha may
  IsFlagNM: number = this._userInfo.R1_GetNhaMayID();
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
    private thietbirootService_: ThietbirootService,
    private thietbiservice_: ThietbiService,
    private nhaMaySevice_: NhamayrootService,
  ) {
    this.options._ThietbiID = sessionStorage.getItem('ThietBiID');
    this.DayInsMonth = this.baoduongdinhkyservice_.r1DayInsMonth(this.date);
    if (this.DayInsMonth === undefined) {
      this.DayInsMonth = 31;
    }
    this.Active = false;
    this.MaThietBi = sessionStorage.getItem('MaThietBi');
  }
  // nhà máy
  nhaMayID$ = this.nhaMaySevice_.$nhaMayID;
  ngOnInit() {
    let Permission = this._userInfo.r1GetobjPermission();
    if (Permission === undefined) {
      Permission = 'NoAdmin';
    }
    this.permissionsService.loadPermissions([`${Permission}`]);

    this.R1GetListThietBi();
    this.nhaMayID$.subscribe(res => {
      if (res !== undefined) {
    this.R1GetListThietBi();
      }
    });
  }
  // danh sách thiet bi
  R1GetListThietBi() {
    this.options.NhaMayID = Number(localStorage.getItem('NhaMayID'));
    const model_ = { NhaMayID: this.options.NhaMayID };
    this.spinnerService.show();
    this.sub = this.khuvucmayservice_.r1Listthietbi(model_).subscribe(async res => {
      this.spinnerService.hide();
      if (await res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      const data = await res['data'];
      if (data !== undefined) {
        this.listThietBi_ = data;
      }
      if (data.length === 0) {
        this.options._ThietbiID = '';
      } else if (this.options._ThietbiID === '') {
        this.options._ThietbiID = this.listThietBi_[0].ThietBiID;
      }
      if (sessionStorage.getItem('ThietBiID') === null) {
        this.options._ThietbiID = this.listThietBi_[0].ThietBiID;
      }
        this.R1GetListBaoDuongDinhKy();
    });
  }
  // danh sách bao dưởng định kỳ
  R1GetListBaoDuongDinhKy() {
    this.options.NhaMayID = Number(localStorage.getItem('NhaMayID'));
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
    const data = this.listbaoduongdinhky_.filter(x => x.IsChange === true);
    if (data !== undefined) {
      if (data.length === 0) {
        this.toastr.info('Không có trường nào thay đổi, Vui lòng kiểm tra lại!', 'Thông báo');
        return false;
      }
    } else {
      this.toastr.info('Lỗi khi luu thay đổi kiểm tra bảo dưỡng hàng ngày, Vui lòng kiểm tra lại!', 'Thông báo');
      return false;
    }
    this.baoduongdinhkyservice_.r2LuuThayDoi(data).subscribe(res => {
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
    row.IsChange = true;
    if (itemD === 'D' || itemD.toUpperCase() === 'KD') {
    } else if (itemD === 'd') {
      switch (res) {
        case 'D1':
          row.D1 = 'D';
          break;
        case 'D2':
          row.D2 = 'D';
          break;
        case 'D3':
          row.D3 = 'D';
          break;
        case 'D4':
          row.D4 = 'D';
          break;
        case 'D5':
          row.D5 = 'D';
          break;
        case 'D6':
          row.D6 = 'D';
          break;
        case 'D7':
          row.D7 = 'D';
          break;
        case 'D8':
          row.D8 = 'D';
          break;
        case 'D9':
          row.D9 = 'D';
          break;
        case 'D10':
          row.D10 = 'D';
          break;
        case 'D11':
          row.D11 = 'D';
          break;
        case 'D12':
          row.D12 = 'D';
          break;
        case 'D13':
          row.D13 = 'D';
          break;
        case 'D14':
          row.D14 = 'D';
          break;
        case 'D15':
          row.D15 = 'D';
          break;
        case 'D16':
          row.D16 = 'D';
          break;
        case 'D17':
          row.D17 = 'D';
          break;
        case 'D18':
          row.D18 = 'D';
          break;
        case 'D19':
          row.D19 = 'D';
          break;
        case 'D20':
          row.D20 = 'D';
          break;
        case 'D21':
          row.D21 = 'D';
          break;
        case 'D22':
          row.D22 = 'D';
          break;
        case 'D23':
          row.D23 = 'D';
          break;
        case 'D24':
          row.D24 = 'D';
          break;
        case 'D25':
          row.D25 = 'D';
          break;
        case 'D26':
          row.D26 = 'D';
          break;
        case 'D27':
          row.D27 = 'D';
          break;
        case 'D28':
          row.D28 = 'D';
          break;
        case 'D29':
          row.D29 = 'D';
          break;
        case 'D30':
          row.D30 = 'D';
          break;
        case 'D31':
          row.D31 = 'D';
          break;
        default:
          break;
      }
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
  // change
  ChangeThang(IsTime) {
    const dateopt = this.datepipe.transform(IsTime, 'yyyy-MM-dd');
    this.options.IsTime = new Date(dateopt);
    this.R1GetListBaoDuongDinhKy();
  }
  ChangeNhaMay() {
    this.R1GetListThietBi();
  }
  ChangeThietBi() {
    sessionStorage.setItem('ThietBiID', this.options._ThietbiID);
    this.ThietBiID = this.options._ThietbiID;
    this.thietbirootService_.r1getThietBiByID(this.options._ThietbiID).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo');
          return false;
        }
        const objThietBi = res['data'];
        sessionStorage.setItem('MaThietBi', objThietBi.MaThietBi);
        this.MaThietBi = objThietBi.MaThietBi;
        this.R1GetListBaoDuongDinhKy();
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
