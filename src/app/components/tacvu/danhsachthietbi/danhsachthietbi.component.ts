import { Subscription } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SearchService } from '../../../shared/search.service';
import { UserInfoService } from '../../../shared/user-info.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { ThietbiService } from '../../danhmuc/thietbi/thietbi.service';
import { Thietbi, Thongsokythuat } from '../../danhmuc/thietbi/thietbi';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { NhamayrootService } from '../../../shared/nhamayroot.service';
@Component({
  selector: 'app-danhsachthietbi',
  templateUrl: './danhsachthietbi.component.html',
  styleUrls: ['./danhsachthietbi.component.scss']
})
export class DanhsachthietbiComponent implements OnInit {
 options = {s: '', p: 1, pz: 20, totalpage: 0, total: 0, paxpz: 0, mathP: 0, NhomThietBiID: '', NhaMayID: null};

  private subscription: Subscription;
  private subscription2: Subscription;
  private subscription1: Subscription;

  todos$ = this.s.$search;
  // thiết bị
modelthietbi_: Thietbi;
listthietbi_: Thietbi[];
litsthongsocoban_: Thongsokythuat[] = [];
litsthongsochitiet_: Thongsokythuat[] = [];
litsthongsokythuat_: Thongsokythuat[] = [];
  // list nhóm thiết bị
  listNhomThietBi_: {}[];
  // string
  public modeltitle: string;
  CheckLength: number;
  ThietBiID: string;



  constructor(
    private spinnerService: Ng4LoadingSpinnerService ,
    private s: SearchService,
    private _userInfo: UserInfoService,
    private toastr: ToastrService,
    private  permissionsService: NgxPermissionsService,
   private thietbiservice_: ThietbiService,
   private nhaMaySevice_: NhamayrootService,
   private router: Router,
  ) {
  }
  // nhà máy
  nhaMayID$ = this.nhaMaySevice_.$nhaMayID;
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
    };
    this.listNhomThietBi_ = [{
      NhomThietBiID: '',
      TenNhom: ''
    }];
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
 this.nhaMayID$.subscribe(res => {
      if (res !== undefined) {
    this.R1GetListThietBi();
      }
    });
    this.R1GetNhomThietBi();
  }
  SetTotalPage() {
    this.options.totalpage = Math.ceil(this.options.total / this.options.pz);
    this.options.mathP = this.options.pz * this.options.p;
}
// danh sách thiet bi
R1GetListThietBi() {
  this.options.NhaMayID = Number(localStorage.getItem('NhaMayID'));
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
// danh sách nhóm thiết bị
r1GetListNhomTB() {
  this.subscription2 = this.thietbiservice_.r1Listnhomthietbi().subscribe(res => {
       if (res !== undefined) {
         this.listNhomThietBi_ = res['data'];
       }
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
R1GetNhomThietBi() {
  this.spinnerService.show();
   this.subscription = this.thietbiservice_.r1Listnhomthietbi().subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.listNhomThietBi_ = res['data'];
});
}
ChuyensangTrangHomeThietBi(ThietBiID: string, MaThietBi: string) {
  sessionStorage.setItem('ThietBiID', ThietBiID);
  sessionStorage.setItem('MaThietBi', MaThietBi);
 this.router.navigate(['/tacvu/homethietbi']);
}
  // change
  NhomTBChanged() {
    this.R1GetListThietBi();
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
