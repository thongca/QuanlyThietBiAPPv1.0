import { MenuDetailService } from './../../../shared/menu-detail.service';
import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SearchService } from '../../../shared/search.service';
import { UserInfoService } from '../../../shared/user-info.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Thietbi, Thongsokythuat } from '../../danhmuc/thietbi/thietbi';
import { ThietbiService } from '../../danhmuc/thietbi/thietbi.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-homethietbi',
  templateUrl: './homethietbi.component.html',
  styleUrls: ['./homethietbi.component.scss'],
})
export class HomethietbiComponent implements OnInit {
  private options = {s: '', p: 1, pz: 200000, totalpage: 0, total: 0, paxpz: 0, mathP: 0, NhomThietBiID: ''};
  listmenu_: {}[];
  private subscription: Subscription;
  private subscription2: Subscription;
  private subscription1: Subscription;

  todos$ = this.s.$search;
  // thiết bị
  private modelthietbi_: Thietbi;
private listthietbi_: Thietbi[];
private modelthongsokythuat_: Thongsokythuat;
private litsthongsokythuat_: Thongsokythuat[] = [];
  // list
 private listNhomThietBi_: {}[];

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
   private menuservice_: MenuDetailService,
   private thietbiservice_: ThietbiService,
   private router: Router,
  ) {
    this.ThietBiID = sessionStorage.getItem('ThietBiID');
    if (this.ThietBiID === null || this.ThietBiID === undefined) {
      this.router.navigateByUrl('/tacvu/danhsachthietbi');
      this.toastr.warning('Bạn chưa chọn thiết bị, vui lòng chọn thiết bị để tiếp tục!', 'Cảnh báo');
    }
   }

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
    this.ListMenu();
    this.R1GetListThietBi();
  }

  ListMenu() {
    this.subscription2 = this.menuservice_.getDataHomemenu().subscribe(res => {
      if (res !== undefined) {
        this.listmenu_ = res['data'];
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
});
}

GetInfoDevices(row: Thietbi) {
  this.modelthietbi_ = row;
}
// modal
SelectIDEditModel(ThietBiID: string) {
  this.ThietBiID = ThietBiID;
  this.listthietbi_.forEach(function(item) {
    if (item.ThietBiID === ThietBiID) {
      item.checked = true;
    } else {
      item.checked = false;
    }
  });
 this.subscription1 =  this.thietbiservice_.r1GetThietbibyID(ThietBiID).subscribe(res => {
    if (res !== undefined) {
      if (res['error']  === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
      }
     this.modelthietbi_ = res['datatb'];
     this.litsthongsokythuat_ = res['dataTs'];
    }
  });
}
GoPage(Link: string) {
  this.router.navigateByUrl(Link);
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
