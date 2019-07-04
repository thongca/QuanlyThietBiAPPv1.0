import { Subscription } from 'rxjs/internal/Subscription';
import { KhuvucvesinhcongnghiepService } from './khuvucvesinhcongnghiep.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Khuvucvesinhcongnghiep } from './khuvucvesinhcongnghiep.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SearchService } from '../../../shared/search.service';
import { UserInfoService } from '../../../shared/user-info.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { ModalDirective } from 'ngx-bootstrap';
import { KhuvucmayService } from '../khuvucmay/khuvucmay.service';

@Component({
  selector: 'app-khuvucvesinhcongnghiep',
  templateUrl: './khuvucvesinhcongnghiep.component.html',
  styleUrls: ['./khuvucvesinhcongnghiep.component.scss']
})
export class KhuvucvesinhcongnghiepComponent implements OnInit {
  options = {s: '', p: 1, pz: 20, totalpage: 0, total: 0, paxpz: 0, mathP: 0, _ThietbiID: '', NhaMayID: null};
  CheckLength: number;
  checkall: boolean;
  sub: Subscription;
  // string
modeltitle: string;
KhuVucVSCNID: string;
// list
modelKhuVucVs_: Khuvucvesinhcongnghiep;
listKhuVucVs_: Khuvucvesinhcongnghiep[];
listThietBi_: {
  ThietBiID: string;
  TenThietBi: string;
}[];
  // tìm kiếm
  todos$ = this.s.$search;

  constructor(
    private spinnerService: Ng4LoadingSpinnerService ,
    private s: SearchService,
    private _userInfo: UserInfoService,
    private toastr: ToastrService,
    private  permissionsService: NgxPermissionsService,
    private khuvucvsService_: KhuvucvesinhcongnghiepService,
    private khuvucmayservice_: KhuvucmayService,
  ) {
    this.checkall = false;
    this.options.NhaMayID = this._userInfo.R1_GetNhaMayID();
   }
  @ViewChild('largeModal') public largeModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  ngOnInit() {
    this.listKhuVucVs_ = [{
      KhuVucVSCNID: '',
      TenKhuVucVSCN: '',
      ThietBiID: '',
      ThuTu: '',
      MaThietBi: '',
      checked: false,
    }];
    this.modelKhuVucVs_ = {
      KhuVucVSCNID: '',
      TenKhuVucVSCN: '',
      ThietBiID: '',
      ThuTu: '',
      MaThietBi: '',
      checked: false
    };
    this.r1ListKhuVucVS();
    this.R1GetListThietBi();
     // tìm kiếm
     this.todos$.subscribe(res => {
      if (res === undefined || res === '') {
        this.options.s = '';
        this.r1ListKhuVucVS();
      } else {
        this.options.s = res;
        this.r1ListKhuVucVS();
      }
    });
  }
  SetTotalPage() {
    this.options.totalpage = Math.ceil(this.options.total / this.options.pz);
    this.options.mathP = this.options.pz * this.options.p;
}
  // danh sách khu vực vệ sinh theo thiết bị
  r1ListKhuVucVS() {
    this.khuvucvsService_.r1ListKhuVucVS(this.options).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo lỗi');
          return false;
        }
        this.listKhuVucVs_ = res['data'];
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
    // danh sách thiet bi
    R1GetListThietBi() {
      this.spinnerService.show();
      this.sub = this.khuvucmayservice_.r1Listthietbi(this.options).subscribe(res => {
        this.spinnerService.hide();
        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo lỗi');
          return false;
        }
        this.listThietBi_ = res['data'];
      });
    }
  SelectIDEditModel(KhuVucVSCNID) {
    this.modeltitle = 'Sửa khu vực vệ sinh công nghiệp';
    this.KhuVucVSCNID = KhuVucVSCNID;
    this.khuvucvsService_.r1GetKhuVucVSTBbyID(KhuVucVSCNID).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo');
          return false;
        }
        this.modelKhuVucVs_ = res['data'];
        this.largeModal.show();
      }
    }
    );
  }
// thêm mới, sửa đơn vị tính
R2AdDataKhuVucVeSinh(): boolean {
  if (this.options._ThietbiID === '') {
    this.toastr.warning('Vui lòng chọn thiết bị trước khi thêm mới khu vực', 'Cảnh báo');
    return false;
  }
  this.modelKhuVucVs_.ThietBiID = this.options._ThietbiID;
  if (this.modelKhuVucVs_.TenKhuVucVSCN === '') {
  this.toastr.warning('Vui lòng nhập thông tin vào các trường có dấu (*)', 'Cảnh báo');
    return false;
  }
  if (this.modelKhuVucVs_.KhuVucVSCNID === '' || this.modelKhuVucVs_.KhuVucVSCNID === null) {
    this.spinnerService.show();
    this.khuvucvsService_.R2AddKhuVucVS(this.modelKhuVucVs_).subscribe(res => {
      this.spinnerService.hide();
      if (res !== undefined) {
          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          } else {
            this.toastr.success('Thêm mới khu vực vệ sinh thành công.', 'Thông báo');
            this.r1ListKhuVucVS();
            this.largeModal.hide();
          }
      }
    });
  } else {
    this.spinnerService.show();
    this.khuvucvsService_.r3updateKhuVucVS(this.KhuVucVSCNID, this.modelKhuVucVs_).subscribe(res => {
      this.spinnerService.hide();
        if (res !== undefined) {
          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          }
          this.toastr.success('Sửa khu vực vệ sinh thành công!', 'Thông báo');
          this.r1ListKhuVucVS();
          this.largeModal.hide();
        }
    });
  }

}
HideModal() {
  this.largeModal.hide();
}
xacnhanXoa(rowto) {
  if (this.CheckLength > 0) {
    this.r4DelKhuVucVS(rowto);
  }
}
r4DelKhuVucVS(rowto) {
  const arr = [
   ];
   rowto.forEach(function (item) {
     if (item.checked) {
       const obj = {KhuVucVSCNID: item.KhuVucVSCNID};
      arr.push(obj);
     }
 });
   this.khuvucvsService_.r4deleteKhuVucVS(arr).subscribe(res => {
     if (res !== undefined) {
       if (res['error'] === 1) {
       this.toastr.error(res['ms'], 'Thông báo lỗi');
         return false;
       }
       this.warningModal.hide();
       this.toastr.success('Xóa thành công khu vực vệ sinh thành công', 'Thông báo');
       this.CheckLength = 0;
       this.r1ListKhuVucVS();
     }
   });
 }
  // thay đổi thiết bị
  thietBiChanged() {
    this.r1ListKhuVucVS();
  }
// mở modal thêm mới
  Showmodal(check) {
    if (check === 'add') {
      this.modeltitle = 'Thêm mới khu vực vệ sinh công nghiệp';
      this.modelKhuVucVs_ = {
        KhuVucVSCNID: '',
        TenKhuVucVSCN: '',
        MaThietBi: '',
        ThuTu: '',
        ThietBiID: '',
      checked: false};
      this.largeModal.show();
    } else {
  }
  }
  // checked
toggleAll (rowto, checked) {
  this.CheckLength = 0;
  rowto.forEach(function (value, key) {
      rowto[key].checked = !checked;
  });
  const listvitrual = this.listKhuVucVs_.filter(c => c.checked === true);
  this.CheckLength = listvitrual.length;
}
CheckedList(checked) {
  const listvitrual = this.listKhuVucVs_.filter(c => c.checked === true);
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
// Phân trang
NextPage() {
  if (this.options.p < this.options.totalpage) {
  this.options.p++;
  this.r1ListKhuVucVS();
  }
}

PrevPage() {
  if (this.options.p > 1) {
  this.options.p--;
  this.r1ListKhuVucVS();
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
