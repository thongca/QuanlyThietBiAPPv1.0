import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { BcvesinhhangngayService } from './bcvesinhhangngay.service';
import { Bcvesinhhangngay } from './bcvesinhhangngay.model';
import { DatePipe } from '@angular/common';
import { SearchService } from '../../../shared/search.service';
import { UserInfoService } from '../../../shared/user-info.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { BaocaovesinhcongnghiepService } from '../baocaovesinhcongnghiep/baocaovesinhcongnghiep.service';
import { BsLocaleService } from 'ngx-bootstrap';
import { NhamayrootService } from '../../../shared/nhamayroot.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { viLocale } from 'ngx-bootstrap/locale';
import { KhuvucmayService } from '../../danhmuc/khuvucmay/khuvucmay.service';
import { Thietbi } from '../../danhmuc/thietbi/thietbi';
import * as $ from 'jquery';
defineLocale('vi', viLocale);
@Component({
  selector: 'app-baocaovesinhmayhangngay',
  templateUrl: './baocaovesinhmayhangngay.component.html',
  styleUrls: ['./baocaovesinhmayhangngay.component.scss']
})
export class BaocaovesinhmayhangngayComponent implements OnInit {
  date: Date = new Date();
  DayInMonths: number;
  Active: boolean;
 // options
 options = {s: '', p: 1, pz: 20000, totalpage: 0, total: 0, paxpz: 0, mathP: 0,
 _ThietbiID: '', IsTime : this.date, NhaMayID: null};
// list
listBaoCao: Bcvesinhhangngay[];
listThietBi_: Thietbi[] = [];
  constructor(
    public datepipe: DatePipe,
   private s: SearchService,
   private _userInfo: UserInfoService,
   private khuvucmayservice_: KhuvucmayService,
   private toastr: ToastrService,
   private  permissionsService: NgxPermissionsService,
   private spinnerService: Ng4LoadingSpinnerService ,
   private baocaovscnservice_: BaocaovesinhcongnghiepService,
   private datelageService: BsLocaleService,
   private nhaMaySevice_: NhamayrootService,
    private bcvesinhhangngay_: BcvesinhhangngayService,
  ) {
    this.datelageService.use('vi');
    this.Active = false;
  }
  // search
  todos$ = this.s.$search;
  ngOnInit() {
    this.r1ListBaoCaoVSHangNgay();
    this.todos$.subscribe(res => {
      if (res === undefined || res === '') {
        this.options.s = '';
        this.r1ListBaoCaoVSHangNgay();
      } else {
        this.options.s = res;
        this.r1ListBaoCaoVSHangNgay();
      }
    });
    this.R1GetListThietBi();
  }
    // danh sách thiet bi
    R1GetListThietBi() {
      this.options.NhaMayID = Number(localStorage.getItem('NhaMayID'));
      this.spinnerService.show();
      this.khuvucmayservice_.r1Listthietbi(this.options).subscribe(res => {
        this.spinnerService.hide();
        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo lỗi');
          return false;
        }
        const data = res['data'];
        if (data !== undefined) {
            this.options._ThietbiID = '';
            this.listThietBi_ = data;
        }
      });
    }
  r1ListBaoCaoVSHangNgay() {
    this.bcvesinhhangngay_.r1ListBaocaoVesinhHN(this.options).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo');
          return false;
        }
        let data = res['data'];
        if (this.options._ThietbiID !== '' && this.options._ThietbiID !== null) {
          data = data.filter(x => x.ThietBiID === this.options._ThietbiID);
        }
        if (this.options.s !== '' && this.options.s !== null) {
          this.listBaoCao = data.filter(item =>
             (item.TenThietBi.toUpperCase().includes(this.options.s.toUpperCase()))
              || (item.MaThietBi.toUpperCase().includes(this.options.s.toUpperCase())));
        } else {
          this.listBaoCao  = data;
        }
       const dayinm = res['DayInMonths'];
        this.listBaoCao.forEach( function(item) {
          if (item.Dat !== undefined && dayinm !== undefined && dayinm > 0) {
            item.TiLeHoanThanh = (item.Dat / dayinm) * 100;
          }
          });
      }
    });
  }
  ThietBiChanged() {
    this.r1ListBaoCaoVSHangNgay();
  }
  ChangeThang(IsTime) {
    const dateopt = this.datepipe.transform(IsTime, 'yyyy-MM-dd');
    this.options.IsTime = new Date(dateopt);
    this.r1ListBaoCaoVSHangNgay();
  }
  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
   }
     // làm mới trang
  refreshData() {
    this.options.s = '';
    this.options._ThietbiID = '';
    this.s.SearchRoot(this.options.s);
    this.options.p = 1;
    this.toastr.success('Tải lại trang thành công', 'Thông báo');
    this.ngOnInit();
  }
  InBaoCao() {
    setTimeout(() => {
      $('#btnprint').click();
     }, 50);
  }
  Event(e) {
    if (e.target.closest('.select-tieuchi') === null) {
      this.Active = false;
    }
  }
}
