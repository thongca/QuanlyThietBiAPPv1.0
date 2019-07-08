import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SearchService } from '../../../shared/search.service';
import { UserInfoService } from '../../../shared/user-info.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Subscription } from 'rxjs';
import { Baocaovesinhcongnghiep } from './baocaovesinhcongnghiep.model';
import { BaocaovesinhcongnghiepService } from './baocaovesinhcongnghiep.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { viLocale } from 'ngx-bootstrap/locale';
import { DatePipe } from '@angular/common';
defineLocale('vi', viLocale);
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import * as $ from 'jquery';
import { NhamayrootService } from '../../../shared/nhamayroot.service';
@Component({
  selector: 'app-baocaovesinhcongnghiep',
  templateUrl: './baocaovesinhcongnghiep.component.html',
  styleUrls: ['./baocaovesinhcongnghiep.component.scss']
})
export class BaocaovesinhcongnghiepComponent implements OnInit, OnDestroy {
date: Date = new Date();
Month_: number;
CoTuan5: boolean;
 // subscript
 private subscription: Subscription;
 // options
options = {s: '', p: 1, pz: 2000, totalpage: 0, total: 0, paxpz: 0, mathP: 0,
 _ThietbiID: '', IsTime : this.date, NhaMayID: null};
 // model
 litsVsCN_: Baocaovesinhcongnghiep[] = [];

   // string
   public modeltitle: string;
   CheckLength: number;
   KhuVucID: string;
   ChiTietID: string;
   checkall: boolean;
   errormodal: string;
// boolean
IsFlag: boolean;

   // tìm kiếm
   todos$ = this.s.$search;

 constructor(
   public datepipe: DatePipe,
   private s: SearchService,
   private _userInfo: UserInfoService,
   private toastr: ToastrService,
   private  permissionsService: NgxPermissionsService,
   private spinnerService: Ng4LoadingSpinnerService ,
   private baocaovscnservice_: BaocaovesinhcongnghiepService,
   private datelageService: BsLocaleService,
   private nhaMaySevice_: NhamayrootService,
 ) {
  this.datelageService.use('vi');
  this.Month_ = this.date.getMonth() + 1;
  this.CoTuan5 = false;
  }
  // nhà máy
  nhaMayID$ = this.nhaMaySevice_.$nhaMayID;
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
       this.R1GetListVSCN();
     } else {
       this.options.s = res;
       this.R1GetListVSCN();
     }
   });
   this.R1GetListVSCN();
        // tìm kiếm
        this.nhaMayID$.subscribe(res => {
          if (res !== undefined) {
        this.R1GetListVSCN();
          }
        });
 }

 SetTotalPage() {
   this.options.totalpage = Math.ceil(this.options.total / this.options.pz);
   this.options.mathP = this.options.pz * this.options.p;
}
// danh sách báo cáo
R1GetListVSCN() {
  this.options.NhaMayID = Number(localStorage.getItem('NhaMayID'));
 this.spinnerService.show();
  this.subscription = this.baocaovscnservice_.r1ListBaocaoVSCN(this.options).subscribe(res => {
     this.spinnerService.hide();
     if (res['error'] === 1) {
       this.toastr.error(res['ms'], 'Thông báo lỗi');
       return false;
     }
     if (res['error'] === 2) {
      this.toastr.error(res['ms'], 'Thông báo lỗi');
    }
    this.litsVsCN_ = res['data'];
    if (this.litsVsCN_.filter(x => x.CoTuan5 === true).length > 0) {
      this.CoTuan5 = true;
    }
},
err => {
  if (err.status === 500) {
    this.toastr.error('Mất kết nối máy chủ, vui lòng kiểm tra lại đường dẫn!', 'Thông báo');
    return false;
  } else if (err.status === 404) {
    this.toastr.error('Tài khoản của bạn xác thực không thành công, vui lòng thử lại!', 'Thông báo');
    return false;
  } else if (err.status === 400) {
    this.toastr.error('Vui lòng kiểm tra lại các giá trị bạn đang nhập, hoặc liên hệ quản trị viên!', 'Thông báo');
    return false;
  }
});
}

// làm mới trang
refreshData() {
 this.options.s = '';
 this.s.SearchRoot(this.options.s);
 this.options.p = 1;
 this.toastr.success('Tải lại trang thành công', 'Thông báo');
}
InBaoCao() {
  setTimeout(() => {
    $('#btnprint').click();
   }, 50);
}

// Tìm kiếm
// Phân trang
NextPage() {
 if (this.options.p < this.options.totalpage) {
 this.options.p++;
 this.R1GetListVSCN();
 }
}

PrevPage() {
 if (this.options.p > 1) {
 this.options.p--;
 this.R1GetListVSCN();
 }
}

ngOnDestroy() {
 if (this.subscription) {
   this.subscription.unsubscribe();
 }
}
ChangeThang(IsTime) {
  const dateopt = this.datepipe.transform(IsTime, 'yyyy-MM-dd');
  this.options.IsTime = new Date(dateopt);
  this.R1GetListVSCN();
}
onOpenCalendar(container) {
  container.monthSelectHandler = (event: any): void => {
    container._store.dispatch(container._actions.select(event.date));
  };
  container.setViewMode('month');
 }
}
