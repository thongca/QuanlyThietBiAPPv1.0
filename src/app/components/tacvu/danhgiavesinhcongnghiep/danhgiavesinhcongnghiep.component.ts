import { filter } from 'rxjs/operators';
import { DanhgiavesinhcongnghiepService } from './danhgiavesinhcongnghiep.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SearchService } from '../../../shared/search.service';
import { UserInfoService } from '../../../shared/user-info.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Subscription } from 'rxjs';
import { Danhgiavesinhcongnghiep, Children } from './danhgiavesinhcongnghiep.model';
import * as cloneDeep from 'lodash/cloneDeep';
import { Thietbi } from './../../danhmuc/thietbi/thietbi';
import { KhuvucmayService } from '../../danhmuc/khuvucmay/khuvucmay.service';
import { ThietbirootService } from '../../../shared/thietbiroot.service';
@Component({
  selector: 'app-danhgiavesinhcongnghiep',
  templateUrl: './danhgiavesinhcongnghiep.component.html',
  styleUrls: ['./danhgiavesinhcongnghiep.component.scss']
})
export class DanhgiavesinhcongnghiepComponent implements OnInit, OnDestroy {
  // int
LaPhongK: number;
TuanMay: number;
// return import
returnImport: {
  error: number;
};
T5: boolean;
Active: boolean;
  date: Date = new Date();
  options = {s: '', p: 1, pz: 2000, totalpage: 0, total: 0, paxpz: 0,
  mathP: 0, _ThietbiID: '', KhuVucVSCNID: '', IsTime: '', T5: true, VeSinhCongNghiepMID: '' };
  @ViewChild('ImportExModal') public ImportExModal: ModalDirective;
  @ViewChild('xacnhanExModal') public xacnhanExModal: ModalDirective;
  private subscription: Subscription;
  private sub: Subscription;
// file
  _files: File;
  // string
  ThietBiID: string;
  modaltitle: string;
  VeSinhCongNghiepMID: string;
  MaThietBi: string;
  // obj
  objDiemDanhGia: {
    TongDiemT1: number;
    totalT1: number;
    TongDiemT2: number;
    totalT2: number;
    TongDiemT3: number;
    totalT3: number;
    TongDiemT4: number;
    totalT4: number;
    TongDiemT5: number;
    totalT5: number;
  };
  modelUser_: {
    UserName: string;
    Password: string;
  };
  modelPM: {
    VeSinhCongNghiepMID: string;
        NguoiXacNhanT1ID: string
        NguoiXacNhanT2ID: string
        NguoiXacNhanT3ID: string
        NguoiXacNhanT4ID: string
        NguoiXacNhanT5ID: string
        NguoiVanHanhIDT1: string
        NguoiVanHanhIDT2: string
        NguoiVanHanhIDT3: string
        NguoiVanHanhIDT4: string
        NguoiVanHanhIDT5: string
  };

  datacheck_: {
    IsCheckT1: number;
    IsCheckT2: number;
    IsCheckT3: number;
    IsCheckT4: number;
    IsCheckT5: number;
};
// list
litsKhuVucVs_: {
  TenKhuVucVSCN: string;
  KhuVucVSCNID: string;
}[];
listVeSinhCongNghiep_: Danhgiavesinhcongnghiep[];
// list
listThietBi_: Thietbi[] = [];


  constructor(
    private s: SearchService,
    private _userInfo: UserInfoService,
    private toastr: ToastrService,
    private  permissionsService: NgxPermissionsService,
    private spinnerService: Ng4LoadingSpinnerService ,
    private danhgiavscongnghiepService_: DanhgiavesinhcongnghiepService,
    private khuvucmayservice_: KhuvucmayService,
    private thietbirootService_: ThietbirootService
  ) {
    this.datacheck_ = {
      IsCheckT1: 0,
    IsCheckT2: 0,
    IsCheckT3: 0,
    IsCheckT4: 0,
    IsCheckT5: 0,
    };
    this.ThietBiID = sessionStorage.getItem('ThietBiID');
    this.modelUser_ = {
      UserName: '',
      Password: ''
    };
    this.objDiemDanhGia = {
      TongDiemT1: 0,
      TongDiemT2: 0,
      TongDiemT3: 0,
      TongDiemT4: 0,
      TongDiemT5: 0,
      totalT1: 0,
      totalT2: 0,
      totalT3: 0,
      totalT4: 0,
      totalT5: 0,
    };
    this.modelPM = {
      VeSinhCongNghiepMID: null,
      NguoiXacNhanT1ID: null,
      NguoiXacNhanT2ID: null,
      NguoiXacNhanT3ID: null,
      NguoiXacNhanT4ID: null,
      NguoiXacNhanT5ID: null,
      NguoiVanHanhIDT1: null,
      NguoiVanHanhIDT2: null,
      NguoiVanHanhIDT3: null,
      NguoiVanHanhIDT4: null,
      NguoiVanHanhIDT5: null,
    };
    this.MaThietBi = sessionStorage.getItem('MaThietBi');
    this.Active = false;
  }

  ngOnInit() {
    let Permission = this._userInfo.r1GetobjPermission();
      if (Permission === undefined) {
        Permission = 'NoAdmin';
      }
      this.permissionsService.loadPermissions([`${Permission}`]);
    if (this.date.getMonth() < 10) {
      this.options.IsTime = `${this.date.getFullYear()}-0${this.date.getMonth() + 1}`;
    } else {
      this.options.IsTime = `${this.date.getFullYear()}-${this.date.getMonth() + 1}`;
    }
    if ( this.options.IsTime !== '') {
      this.r1ListKhuVucVeSinhCongNghiep();
      this.r1ListVeSinhCongNghiep();
      this.R1GetListThietBi();
    }
  }
  //ll
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
  r1ListKhuVucVeSinhCongNghiep() {
    this.options._ThietbiID = this.ThietBiID;
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
    this.objDiemDanhGia = {
      TongDiemT1: 0,
      TongDiemT2: 0,
      TongDiemT3: 0,
      TongDiemT4: 0,
      TongDiemT5: 0,
      totalT1: 0,
      totalT2: 0,
      totalT3: 0,
      totalT4: 0,
      totalT5: 0,
    };
    this.options._ThietbiID = this.ThietBiID;
  this.subscription =  this.danhgiavscongnghiepService_.r1ListVeSinhCongNghiep(this.options).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error('Lỗi khi lấy dữ liệu danh sách vệ sinh công nghiệp', 'Thông báo');
          return false;
        }
        if (res['error'] === 2) {
          this.listVeSinhCongNghiep_ = [];
          this.toastr.error(res['ms'], 'Thông báo');
          return false;
        }
        let p = true;
        const data = res['data'];
        for (let index = 0; index < data.length; index++) {
          data[index].children.forEach( function(item) {
            if (item.DanhGiaT1 === true || item.DanhGiaT1 === false) {
              item.DanhGiaKDT1 = !cloneDeep(item.DanhGiaT1);
            }
            if (item.DanhGiaT2 === true || item.DanhGiaT2 === false) {
              item.DanhGiaKDT2 = !cloneDeep(item.DanhGiaT2);
            }
            if (item.DanhGiaT3 === true || item.DanhGiaT3 === false) {
              item.DanhGiaKDT3 = !cloneDeep(item.DanhGiaT3);
            }
            if (item.DanhGiaT4 === true || item.DanhGiaT4 === false) {
              item.DanhGiaKDT4 = !cloneDeep(item.DanhGiaT4);
            }
            if (item.ChiTietT5 !== null) {
              if (item.DanhGiaT5 === true || item.DanhGiaT5 === false) {
                item.DanhGiaKDT5 = !cloneDeep(item.DanhGiaT5);
              }
            }
            if (item.CoTuan5 === true && p === false) {
              p = false;
            }
          });
          this.options.T5 = p;
          this.objDiemDanhGia.TongDiemT1 +=  data[index].children.filter(x => x.DanhGiaT1 === true).length;
          this.objDiemDanhGia.TongDiemT2 +=  data[index].children.filter(x => x.DanhGiaT2 === true).length;
          this.objDiemDanhGia.TongDiemT3 +=  data[index].children.filter(x => x.DanhGiaT3 === true).length;
          this.objDiemDanhGia.TongDiemT4 +=  data[index].children.filter(x => x.DanhGiaT4 === true).length;
          this.objDiemDanhGia.TongDiemT5 +=  data[index].children.filter(x => x.DanhGiaT5 === true).length;
          this.objDiemDanhGia.totalT1 +=  data[index].children.filter(x => x.ChiTietT1 !== '').length;
          this.objDiemDanhGia.totalT2 +=  data[index].children.filter(x => x.ChiTietT2 !== '').length;
          this.objDiemDanhGia.totalT3 +=  data[index].children.filter(x => x.ChiTietT3 !== '').length;
          this.objDiemDanhGia.totalT4 +=  data[index].children.filter(x => x.ChiTietT4 !== '').length;
          this.objDiemDanhGia.totalT5 +=  data[index].children.filter(x => x.ChiTietT5 !== '').length;
        }
        const VeSinhCongNghiepMID = res['VeSinhCongNghiepMID'];
       this.options.VeSinhCongNghiepMID = VeSinhCongNghiepMID;
        this.listVeSinhCongNghiep_ = data;
        this.r1ObjM();
      }
    });
  }
  r1ObjM() {
    this.danhgiavscongnghiepService_.r1ObjM(this.options).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          return false;
        }
        this.modelPM = res['data'];
        this.datacheck_ = res['datacheck'];
      }
    });
  }
R2LuuThayDoiVeSinhCongNghiep() {
  this.spinnerService.show();
  const arr = [];
  for (let index = 0; index < this.listVeSinhCongNghiep_.length; index++) {
    this.listVeSinhCongNghiep_[index].children.forEach( function(item) {
      if (item.IsChange === true) {
        arr.push(item);
      }
    });
  }
  this.danhgiavscongnghiepService_.r2LuuThayDoiVeSinhCongNghiep(arr).subscribe(res => {
    if (res !== undefined) {
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo');
        this.spinnerService.hide();
        return false;
      }
        this.spinnerService.hide();
        this.toastr.success('Cập nhật bảng vệ sinh công nghiệp thành công!', 'Thông báo');
        this.r1ListVeSinhCongNghiep();
    }
  });
}
HideModal() {
  this.ImportExModal.hide();
}
ChangeThietBi() {
  sessionStorage.setItem('ThietBiID', this.options._ThietbiID);
  this.ThietBiID = this.options._ThietbiID;
  this.r1ListVeSinhCongNghiep();
  this.r1ListKhuVucVeSinhCongNghiep();
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
changThang() {
  this.r1ListVeSinhCongNghiep();
}
khuVucChanged() {
  this.r1ListVeSinhCongNghiep();
}
  // chọn một trong hai ở phần đánh giá
  SelectOneInTwoT1(row: Children, t) {
    if (t ===  1) {
      if (!row.DanhGiaT1 === true) {
        row.DanhGiaKDT1 = false;
        this.objDiemDanhGia.TongDiemT1 += 1;
      } else if (!row.DanhGiaT1 === false) {
        this.objDiemDanhGia.TongDiemT1 -= 1;
      }
    } else {
      if (!row.DanhGiaKDT1 === true) {
        if (row.DanhGiaT1 === null || row.DanhGiaT1 === false) {
        } else {
          this.objDiemDanhGia.TongDiemT1 -= 1;
        }
        row.DanhGiaT1 = false;
      }
    }
    row.IsChange = true;
  }
  SelectOneInTwoT2(row: Children, t) {
    if (t ===  1) {
      if (!row.DanhGiaT2 === true) {
        row.DanhGiaKDT2 = false;
        this.objDiemDanhGia.TongDiemT2 += 1;
      } else if (!row.DanhGiaT2 === false) {
        this.objDiemDanhGia.TongDiemT2 -= 1;
      }
    } else {
      if (!row.DanhGiaKDT2 === true) {
        if (row.DanhGiaT2 === null || row.DanhGiaT2 === false) {
        } else {
          this.objDiemDanhGia.TongDiemT2 -= 1;
        }
        row.DanhGiaT2 = false;
      }
    }
    row.IsChange = true;
  }

  SelectOneInTwoT3(row: Children, t) {
    if (t ===  1) {
      if (!row.DanhGiaT3 === true) {
        row.DanhGiaKDT3 = false;
        this.objDiemDanhGia.TongDiemT3 += 1;
      } else if (!row.DanhGiaT3 === false) {
        this.objDiemDanhGia.TongDiemT3 -= 1;
      }
    } else {
      if (!row.DanhGiaKDT3 === true) {
        if (row.DanhGiaT3 === null || row.DanhGiaT3 === false) {
        } else {
          this.objDiemDanhGia.TongDiemT3 -= 1;
        }
        row.DanhGiaT3 = false;
      }
    }
    row.IsChange = true;
  }
  SelectOneInTwoT4(row: Children, t) {
    if (t ===  1) {
      if (!row.DanhGiaT4 === true) {
        row.DanhGiaKDT4 = false;
        this.objDiemDanhGia.TongDiemT4 += 1;
      } else if (!row.DanhGiaT4 === false) {
        this.objDiemDanhGia.TongDiemT4 -= 1;
      }
    } else {
      if (!row.DanhGiaKDT4 === true) {
        if (row.DanhGiaT4 === null || row.DanhGiaT4 === false) {
        } else {
          this.objDiemDanhGia.TongDiemT4 -= 1;
        }
        row.DanhGiaT4 = false;
      }
    }
    row.IsChange = true;
  }
  SelectOneInTwoT5(row: Children, t) {
    if (t ===  1) {
      if (!row.DanhGiaT5 === true) {
        row.DanhGiaKDT5 = false;
        this.objDiemDanhGia.TongDiemT5 += 1;
      } else if (!row.DanhGiaT5 === false) {
        this.objDiemDanhGia.TongDiemT4 -= 1;
      }
    } else {
      if (!row.DanhGiaKDT5 === true) {
        if (row.DanhGiaT5 === null || row.DanhGiaT5 === false) {
        } else {
          this.objDiemDanhGia.TongDiemT5 -= 1;
        }
        row.DanhGiaT5 = false;
      }
    }
    row.IsChange = true;
  }

  XacNhanCD(k, LaPhong) {
    if (LaPhong === 2) { // là cơ điện
      this.modaltitle = 'Xác nhận KT-CĐ';
      this.xacnhanExModal.show();
    } else {
      this.modaltitle = 'Xác nhận của tổ máy';
      this.xacnhanExModal.show();
    }
    this.LaPhongK = LaPhong;
    this.TuanMay = k;
  }
  LuuXacNhan() {
    this.danhgiavscongnghiepService_.r2XacnhanThongtin(
      this.LaPhongK,
      this.TuanMay,
      this.modelUser_,
      this.options.VeSinhCongNghiepMID).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo');
          return false;
        }
        this.xacnhanExModal.hide();
        this.toastr.success('Đã xác nhận thành công!', 'Thông báo');
        this.r1ObjM();
      }
     });
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

r2ImportFile() {
  this.subscription = this.danhgiavscongnghiepService_.R2ImportExcel(this._files).subscribe(res => {
    if (res !== undefined && res['body'] !== undefined) {
      this.returnImport = res['body'];
      if (this.returnImport.error === 1) {
        this.toastr.error(res['ms'], 'Thông báo');
        return false;
      }
      if (this.returnImport.error === 2) {
        this.toastr.error(res['ms'], 'Thông báo');
        return false;
      }
      if (this.returnImport.error === 0) {
        this.ImportExModal.hide();
        this.r1ListVeSinhCongNghiep();
        this.r1ListKhuVucVeSinhCongNghiep();
        this.toastr.success('Import File Excel bảng đánh giá vệ sinh công nghiệp thành công!', 'Thông báo');
      }
    }
  });
}
ngOnDestroy(): void {
 if (this.subscription) {
   this.subscription.unsubscribe();
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
