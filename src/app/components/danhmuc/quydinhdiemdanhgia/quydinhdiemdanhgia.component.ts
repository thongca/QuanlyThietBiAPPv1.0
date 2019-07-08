import { Subscription } from 'rxjs';
import { Quydinhdanhgia } from './quydinhdanhgia.model';
import { QuydinhdanhgiaService } from './quydinhdanhgia.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SearchService } from '../../../shared/search.service';
import { UserInfoService } from '../../../shared/user-info.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { ModalDirective } from 'ngx-bootstrap';
import { NhamayrootService } from '../../../shared/nhamayroot.service';

@Component({
  selector: 'app-quydinhdiemdanhgia',
  templateUrl: './quydinhdiemdanhgia.component.html',
  styleUrls: ['./quydinhdiemdanhgia.component.scss']
})
export class QuydinhdiemdanhgiaComponent implements OnInit, OnDestroy {
  options = {s: '', p: 1, pz: 20, totalpage: 0, total: 0, paxpz: 0, mathP: 0, NhaMayID: null};
  checkall: boolean;
  CheckLength: number;

  // unsub
  private sub: Subscription;
// string
modeltitle: string;
QuyDinhDiemID: string;
// list
  modelQuyDinh_: Quydinhdanhgia;
  listQuyDinh_: Quydinhdanhgia[];
  constructor(
    private spinnerService: Ng4LoadingSpinnerService ,
    private s: SearchService,
    private _userInfo: UserInfoService,
    private toastr: ToastrService,
    private  permissionsService: NgxPermissionsService,
    private quydinhService_: QuydinhdanhgiaService,
    private nhaMaySevice_: NhamayrootService,
  ) { }
  // tìm kiếm
  todos$ = this.s.$search;
  // nhà máy
  nhaMayID$ = this.nhaMaySevice_.$nhaMayID;

  @ViewChild('largeModal') public largeModal: ModalDirective;
  ngOnInit() {
    this.listQuyDinh_ = [{
      TenThietBi: '',
      DiemQuyDinh: 0,
      ThietBiID: '',
      QuyDinhDiemID: ''
    }];
    this.modelQuyDinh_ = {
      QuyDinhDiemID: '',
    ThietBiID: '',
    DiemQuyDinh: 0,
    TenThietBi: '',
    };
     // tìm kiếm
     this.todos$.subscribe(res => {
      if (res === undefined || res === '""') {
        this.options.s = '';
        this.r1ListQuyDinh();
      } else {
        this.options.s = res;
        this.r1ListQuyDinh();
      }
    });
    this.nhaMayID$.subscribe(res => {
      if (res !== undefined) {
    this.r1ListQuyDinh();
      }
    });
    this.r1ListQuyDinh();
  }
  r1ListQuyDinh() {
    this.options.NhaMayID = Number(localStorage.getItem('NhaMayID'));
   this.sub = this.quydinhService_.r1ListQuyDInhDiem(this.options).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo lỗi');
          return false;
        }
        this.listQuyDinh_ = res['data'];
      }
    });
  }
  SelectIDEditModel(QuyDinhDiemID) {
    this.modeltitle = 'Sửa điểm quy định đánh giá';
    this.QuyDinhDiemID = QuyDinhDiemID;
    this.quydinhService_.r1GetQuyDInhDiemTBbyID(QuyDinhDiemID).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo');
          return false;
        }
        this.modelQuyDinh_ = res['data'];
        this.largeModal.show();
      }
    }
    );
  }
  UpdateDiemQuyDinh() {
    this.quydinhService_.r3updateQuyDInhDiem(this.QuyDinhDiemID, this.modelQuyDinh_).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo');
          return false;
        }
        this.r1ListQuyDinh();
        this.largeModal.hide();
        this.toastr.success('Cập nhật dữ liệu điểm quy đinh vệ sinh công nghiệp thành công!', 'Thông báo');
      }
    });
  }
ngOnDestroy() {
if (this.sub) {
  this.sub.unsubscribe();
}
}
HideModal() {
  this.largeModal.hide();
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
