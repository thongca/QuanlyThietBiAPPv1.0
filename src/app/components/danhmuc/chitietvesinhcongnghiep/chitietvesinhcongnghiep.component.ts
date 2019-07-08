import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Danhgiavesinhcongnghiep, Children } from '../../tacvu/danhgiavesinhcongnghiep/danhgiavesinhcongnghiep.model';
import { SearchService } from '../../../shared/search.service';
import { UserInfoService } from '../../../shared/user-info.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { DanhgiavesinhcongnghiepService } from '../../tacvu/danhgiavesinhcongnghiep/danhgiavesinhcongnghiep.service';
import * as cloneDeep from 'lodash/cloneDeep';
import { ModalDirective } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { KhuvucmayService } from '../khuvucmay/khuvucmay.service';
import { ChitietvesinhcongnghiepService } from './chitietvesinhcongnghiep.service';
import { Chitietvesinhcongnghiep } from './chitietvesinhcongnghiep.model';
import { NhamayrootService } from '../../../shared/nhamayroot.service';
@Component({
  selector: 'app-chitietvesinhcongnghiep',
  templateUrl: './chitietvesinhcongnghiep.component.html',
  styleUrls: ['./chitietvesinhcongnghiep.component.scss']
})
export class ChitietvesinhcongnghiepComponent implements OnInit, OnDestroy {

  date: Date = new Date();
  options = {
    s: '', p: 1, pz: 2000, totalpage: 0, total: 0, paxpz: 0,
    mathP: 0, _ThietbiID: '', KhuVucVSCNID: '', IsTime: '', T5: true, NhaMayID: null
  };
  @ViewChild('ImportExModal') public ImportExModal: ModalDirective;
  private subscription: Subscription;
  private sub: Subscription;
  // file
  _files: File;
  // string
  ThietBiID: string;

  // list
  litsKhuVucVs_: {
    TenKhuVucVSCN: string;
    KhuVucVSCNID: string;
  }[];
  listVeSinhCongNghiep_: Chitietvesinhcongnghiep[];
  listThietBi_: {
    ThietBiID: string;
    TenThietBi: string;
  }[];
  rowdelete: {}[];

  //
  public Active: boolean;



  constructor(
    private s: SearchService,
    private _userInfo: UserInfoService,
    private toastr: ToastrService,
    private permissionsService: NgxPermissionsService,
    private spinnerService: Ng4LoadingSpinnerService,
    private danhgiavscongnghiepService_: DanhgiavesinhcongnghiepService,
    private khuvucmayservice_: KhuvucmayService,
    private chitietvesinhCNService_: ChitietvesinhcongnghiepService,
    private nhaMaySevice_: NhamayrootService,
  ) {
    this.Active = false;
    this.options.NhaMayID = this._userInfo.R1_GetNhaMayID();
  }
  // nhà máy
  nhaMayID$ = this.nhaMaySevice_.$nhaMayID;
  ngOnInit() {
    this.rowdelete = [];
    if (this.date.getMonth() < 10) {
      this.options.IsTime = `${this.date.getFullYear()}-0${this.date.getMonth() + 1}`;
    } else {
      this.options.IsTime = `${this.date.getFullYear()}-${this.date.getMonth() + 1}`;
    }
    if (this.options.IsTime !== '') {
      this.R1GetListThietBi();
    }
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
    this.sub = this.khuvucmayservice_.r1Listthietbi(model_).subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.listThietBi_ = res['data'];
      this.options._ThietbiID = this.listThietBi_[0].ThietBiID;
      this.r1ListKhuVucVeSinhCongNghiep();
      this.r1ListVeSinhCongNghiep();
    });
  }
  r1ListKhuVucVeSinhCongNghiep() {
    this.danhgiavscongnghiepService_.r1ListKhucVucVeSinhCongNghiep(this.options).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo');
          return false;
        }
        this.litsKhuVucVs_ = res['data'];
      }
    });
  }
  r1ListVeSinhCongNghiep() {
    this.spinnerService.show();
    this.subscription = this.chitietvesinhCNService_.r1ListVeSinhCongNghiep(this.options).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error('Lỗi khi lấy dữ liệu danh sách vệ sinh công nghiệp', 'Thông báo');
          return false;
        }
        if (res['error'] === 2) {
          this.toastr.error(res['ms'], 'Thông báo');
          return false;
        }
        let p = true;
        const data = res['data'];
        for (let index = 0; index < data.length; index++) {
          data[index].children.forEach(function (item) {
            if (item.CoTuan5 === true && p === false) {
              p = false;
            }
          });
        }
        this.options.T5 = p;
        this.spinnerService.hide();
        this.listVeSinhCongNghiep_ = data;
      }
    });
  }

  R2AddChiTietVsNC() {
    this.spinnerService.show();
    const arr = [];
    for (let index = 0; index < this.listVeSinhCongNghiep_.length; index++) {
      this.listVeSinhCongNghiep_[index].children.forEach(function (item) {
        if (item.IsChange === true) {
          arr.push(item);
        }
      });
    }
    this.chitietvesinhCNService_.r2LuuThayDoiVeSinhCongNghiep(
      this.options.IsTime,
      this.options._ThietbiID,
      arr, this.rowdelete).subscribe(res => {
        if (res !== undefined) {
          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo');
            this.spinnerService.hide();
            return false;
          }
          this.rowdelete = [];
          this.spinnerService.hide();
          this.toastr.success('Cập nhật bảng vệ sinh công nghiệp thành công!', 'Thông báo');
          this.r1ListVeSinhCongNghiep();
        }
      });
  }

  // -----------------------------------------------------
  changThang() {
    this.r1ListVeSinhCongNghiep();
  }
  khuVucChanged() {
    this.r1ListVeSinhCongNghiep();
  }

  ChonFile(files) {
    if (files.length === 0) {
      return;
    }
    // tslint:disable-next-line:prefer-const
    let mimeType = files[0].type;
    this._files = files;
  }
  ImportFile() {
    this.ImportExModal.show();
  }
  thietBiChanged() {
    this.r1ListVeSinhCongNghiep();
    this.r1ListKhuVucVeSinhCongNghiep();
  }
  r2ImportFile() {
    this.subscription = this.danhgiavscongnghiepService_.R2ImportExcel(this._files).subscribe(res => {
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo');
        return false;
      }
      this.r1ListVeSinhCongNghiep();
      this.r1ListVeSinhCongNghiep();
      this.toastr.success('Import File Excel bảng đánh giá vệ sinh công nghiệp thành công!', 'Thông báo');
    });
  }

  Event(e) {
    if (e.target.closest('.select-tieuchi') === null) {
      this.Active = false;
    }
  }
  NotifyCanhBao() {
    this.toastr.warning('Không nên sửa trường này, vì đã tồn tại dữ liệu đánh giá vệ sinh', 'Thông báo');
  }
  XoaRow(index, row) {
    if (this.options.KhuVucVSCNID === '') {
      this.toastr.warning('Vui lòng chọn khu vực trước khi thêm mới chi tiết vệ sinh công nghiệp', 'Thông báo');
      return false;
    }
    if (this.options._ThietbiID === '') {
      this.toastr.warning('Vui lòng chọn thiết bị trước khi thêm mới chi tiết vệ sinh công nghiệp', 'Thông báo');
      return false;
    }
    this.rowdelete.push(row);
    this.listVeSinhCongNghiep_.filter(x => x.KhuVucVSCNID === this.options.KhuVucVSCNID)[0].children.splice(index, 1);
  }
  ChangeRow(row: Children) {
    row.IsChange = true;
  }
  AddRow() {
    if (this.options.KhuVucVSCNID === '') {
      this.toastr.warning('Vui lòng chọn khu vực trước khi thêm mới chi tiết vệ sinh công nghiệp', 'Thông báo');
      return false;
    }
    if (this.options._ThietbiID === '') {
      this.toastr.warning('Vui lòng chọn thiết bị trước khi thêm mới chi tiết vệ sinh công nghiệp', 'Thông báo');
      return false;
    }
    let isFag = false;
    if (this.listVeSinhCongNghiep_.length === 0) {
      isFag = true;
      const objj = {
        KhuVucVSCNID: this.options.KhuVucVSCNID,
        TenKhuVucVSCN: '',
        ThuTu: '',
        ThietBiID: this.options._ThietbiID,
        children: [
          {
            DanhGiaT1: null,
            DanhGiaT2: null,
            DanhGiaT3: null,
            DanhGiaT4: null,
            DanhGiaT5: null,
            ChiTietT1: '',
            ChiTietT2: '',
            ChiTietT3: '',
            ChiTietT4: '',
            ChiTietT5: null,
            UuTienT1: false,
            UuTienT2: false,
            UuTienT3: false,
            UuTienT4: false,
            UuTienT5: false,
            VeSinhCongNghiepDID: null,
            VeSinhCongNghiepMID: null,
            KhuVucVeSinhCNID: this.options.KhuVucVSCNID,
            IsChange: true,
            ThuTu: 0,
            CoTuan5: false
          }
        ]
      };
      this.listVeSinhCongNghiep_.push(objj);
    }
    const obj = {
      DanhGiaT1: null,
      DanhGiaT2: null,
      DanhGiaT3: null,
      DanhGiaT4: null,
      DanhGiaT5: null,
      ChiTietT1: '',
      ChiTietT2: '',
      ChiTietT3: '',
      ChiTietT4: '',
      ChiTietT5: null,
      UuTienT1: false,
      UuTienT2: false,
      UuTienT3: false,
      UuTienT4: false,
      UuTienT5: false,
      VeSinhCongNghiepDID: null,
      VeSinhCongNghiepMID: null,
      KhuVucVeSinhCNID: this.options.KhuVucVSCNID,
      IsChange: true,
      ThuTu: 0,
      CoTuan5: false
    };
    if (isFag === false) {
      this.listVeSinhCongNghiep_.filter(x => x.KhuVucVSCNID === this.options.KhuVucVSCNID)[0].children.push(obj);
    }
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  HideModal() {
    this.ImportExModal.hide();
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
