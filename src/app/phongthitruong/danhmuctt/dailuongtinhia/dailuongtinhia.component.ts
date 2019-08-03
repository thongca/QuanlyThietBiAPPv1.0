import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap';
import { Tieuchitinhgia } from '../tieuchitinhgia/tieuchitinhgia.model';
import { Cachtinhdongia } from '../cachtinhdongia/cachtinhdongia.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SearchService } from '../../../shared/search.service';
import { UserInfoService } from '../../../shared/user-info.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { TieuchitinhgiaService } from '../tieuchitinhgia/tieuchitinhgia.service';
import { NhamayrootService } from '../../../shared/nhamayroot.service';
import { CachtinhService } from '../cachtinhdongia/cachtinh.service';
import { Dailuongtinhgia, LoaiIn, LoaiHop } from './dailuongtinhgia.model';
import { DailuongtinhgiaService } from './dailuongtinhgia.service';

@Component({
  selector: 'app-dailuongtinhia',
  templateUrl: './dailuongtinhia.component.html',
  styleUrls: ['./dailuongtinhia.component.scss']
})
export class DailuongtinhiaComponent implements OnInit, OnDestroy {

  options = { s: '', p: 1, pz: 20, totalpage: 0, total: 0, paxpz: 0, mathP: 0, NhaMayID: 1, LoaiHopID: 1, LoaiInID: 1 };

  // subscript
  private subscription: Subscription;
  private subscription1: Subscription;
  private subscription2: Subscription;

  // modal
  @ViewChild('largeModal') public largeModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;


  checkall: boolean;
  // string
  public modeltitle: string;
  CheckLength: number;
  DaiLuongID: number;
  errormodal: string;
  // obj
  modelDaiLuong_: Dailuongtinhgia;
  // list
  listDonViTinh_: Cachtinhdongia[] = [];
  // list
  listDaiLuong_: Dailuongtinhgia[] = [];
  // danh sách loại in offser, flexo ....
  listLoaiIn: LoaiIn[] = [];
  // danh sách loại số liệu kích thước triển khaim sản phẩm
listLoaiSL_: {
  LoaiSoLieu: number;
  TenLoai: string;
}[] = [];

// danh sách loại hộp
listLoaiHop: LoaiHop[] = [];

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private s: SearchService,
    private _userInfo: UserInfoService,
    private toastr: ToastrService,
    private permissionsService: NgxPermissionsService,
    private nhaMaySevice_: NhamayrootService,
    private dailuongservice_: DailuongtinhgiaService,
  ) {
    this.modelDaiLuong_ = {
      DaiLuongID: 0,
      KHSoLieu: '',
      TenCot: '',
      Title: '',
      STT: 0,
      LoaiInID: 1,
      LoaiSoLieu: 0,
      CongThuc: '',
      LoaiHopID: 0,
      checked: false,
      TenLoaiHop: '',
      TenLoaiIn: ''
    };
    this.listLoaiSL_ = [{
      LoaiSoLieu: 1,
      TenLoai: 'Sản phẩm'},
      {
        LoaiSoLieu: 2,
        TenLoai: 'Kích thước triển khai'}];
  }
  // tìm kiếm
  todos$ = this.s.$search;
  // nhà máy
  nhaMayID$ = this.nhaMaySevice_.$nhaMayID;
  ngOnInit() {
    let Permission = this._userInfo.r1GetobjPermission();
    if (Permission === undefined) {
      Permission = 'NoAdmin';
    }
    this.permissionsService.loadPermissions([`${Permission}`]);

    // tìm kiếm
    this.subscription2 = this.todos$.subscribe(res => {
      if (res === undefined || res === '') {
        this.options.s = '';
        this.R1GetListDaiLuong();
      } else {
        this.options.s = res;
        this.R1GetListDaiLuong();
      }
    });
    this.R1GetListLoaiIn();
    this.R1GetListLoaiHop();
  }
  // tính tông trang
  SetTotalPage() {
    this.options.totalpage = Math.ceil(this.options.total / this.options.pz);
    this.options.mathP = this.options.pz * this.options.p;
  }
  // danh sách loại in
  R1GetListLoaiIn() {
    this.spinnerService.show();
    this.subscription = this.dailuongservice_.r1ListLoaiIn().subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo');
        return false;
      }
      this.listLoaiIn = res['data'];
      this.modelDaiLuong_.LoaiInID =  this.listLoaiIn[0].LoaiInID;
    },
      err => {
        if (err.status === 500) {
          this.toastr.error('Mất kết nối đến máy chủ. Vui lòng kiểm tra lại đường dẫn.', 'Thông báo');
          return false;
        }
      });
  }
    // danh sách loại hộp
    R1GetListLoaiHop() {
      this.spinnerService.show();
      this.subscription = this.dailuongservice_.r1ListLoaiHop().subscribe(res => {
        this.spinnerService.hide();
        if (res['error'] === 1) {
          this.toastr.error(res['ms'], 'Thông báo');
          return false;
        }
        this.listLoaiHop = res['data'];
        this.modelDaiLuong_.LoaiHopID =  this.listLoaiHop[0].LoaiHopID;
      },
        err => {
          if (err.status === 500) {
            this.toastr.error('Mất kết nối đến máy chủ. Vui lòng kiểm tra lại đường dẫn.', 'Thông báo');
            return false;
          }
        });
    }
  // danh sách đơn vị tính
  R1GetListDaiLuong() {
    this.options.NhaMayID = Number(localStorage.getItem('NhaMayID'));
    this.spinnerService.show();
    this.subscription = this.dailuongservice_.r1ListDaiLuong(this.options).subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.listDaiLuong_ = res['data'];
      this.options.total = res['total'];
      this.SetTotalPage();
      if (this.options.p > 1) {
        this.options.paxpz = (this.options.p - 1) * this.options.pz;
      } else {
        this.options.paxpz = 0;
      }
    },
      err => {
        if (err.status === 500) {
          this.toastr.error('Mất kết nối đến máy chủ. Vui lòng kiểm tra lại đường dẫn.', 'Thông báo');
          return false;
        }
      });
  }

  Showmodal(check) {
    if (check === 'add') {
      this.modeltitle = 'Thêm mới đại lượng tính giá';
      this.modelDaiLuong_ = {
        DaiLuongID: 0,
      KHSoLieu: '',
      TenCot: '',
      Title: '',
      STT: 0,
      LoaiInID: 1,
      LoaiSoLieu: 0,
      CongThuc: '',
      LoaiHopID: 0,
      checked: false,
      TenLoaiHop: '',
      TenLoaiIn: ''
      };
      this.largeModal.show();
    } else {
    }
  }

// thêm mới, sửa đơn vị tính
R2AdDataDaiLuong() {
  // this.modelTieuChiTinhGia_.NhaMayID = Number(localStorage.getItem('NhaMayID'));
  // if (this.modelTieuChiTinhGia_.TenTieuChi === '' || this.modelDaiLuong_.CongMax === 0 || this.modelTieuChiTinhGia_.CongMin === 0) {
  // this.toastr.warning('Vui lòng nhập thông tin vào các trường có dấu (*)', 'Cảnh báo');
  //   return false;
  // }
  if (this.modelDaiLuong_.DaiLuongID === 0 || this.modelDaiLuong_.DaiLuongID === null) {
    this.spinnerService.show();
    this.dailuongservice_.R2AddDaiLuong(this.modelDaiLuong_).subscribe(res => {
      this.spinnerService.hide();
      if (res !== undefined) {

          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          } else {
            this.toastr.success('Thêm mới đại lượng tính giá thành công.', 'Thông báo');
            this.R1GetListDaiLuong();
            this.largeModal.hide();
          }
      }
    }, err => {
      if (err.status === 500) {
        this.toastr.error('Mất kết nối đến máy chủ. Vui lòng kiểm tra lại đường dẫn', 'Thông báo');
        return false;
      }
    });
  } else {
    this.spinnerService.show();
    this.dailuongservice_.r3updateDaiLuong(this.DaiLuongID, this.modelDaiLuong_).subscribe(res => {
      this.spinnerService.hide();
        if (res !== undefined) {
          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          }
          this.toastr.success('Sửa đại lượng tính giá thành công!', 'Thông báo');
          this.R1GetListDaiLuong();
          this.largeModal.hide();
        }
    }, err => {
      if (err.status === 500) {
        this.toastr.error('Mất kết nối đến máy chủ. Vui lòng kiểm tra lại đường dẫn', 'Thông báo');
        return false;
      }
      if (err.status === 400) {
        this.toastr.error('Không có phản hồi từ máy chủ. Vui lòng kiểm tra lại đường dẫn', 'Thông báo');
        return false;
      }
    });
  }
}
// modal
SelectIDEditModel(DaiLuongID: number) {
  this.modeltitle = 'Sửa đại lượng tính giá';
  this.DaiLuongID = DaiLuongID;
 this.subscription1 =  this.dailuongservice_.r1GetDLGbyID(DaiLuongID).subscribe(res => {
    if (res !== undefined) {
      if (res['error']  === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
     this.modelDaiLuong_ = res['data'];
    }
    this.largeModal.show();
  });
}

HideModal() {
  this.largeModal.hide();
  this.R1GetListDaiLuong();
}

xacnhanXoa(rowto) {
  if (this.CheckLength > 0) {
    this.r4DelDaiLuong(rowto);
  }
}
r4DelDaiLuong(rowto) {
 const arr = [
  ];
  rowto.forEach(function (item) {
    if (item.checked) {
      const obj = {DaiLuongID: item.DaiLuongID};
     arr.push(obj);
    }
});
  this.dailuongservice_.r4deleteDaiLuong(arr).subscribe(res => {
    if (res !== undefined) {
      if (res['error'] === 1) {
      this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.warningModal.hide();
      this.toastr.success('Xóa thành công đại lượng', 'Thông báo');
      this.CheckLength = 0;
      this.R1GetListDaiLuong();
    }
  });
}
// change
LoaiHopChanged() {
  this.R1GetListDaiLuong();
}
LoaiInChanged() {
  this.R1GetListDaiLuong();
}
// checked
toggleAll (rowto, checked) {
  this.CheckLength = 0;
  rowto.forEach(function (value, key) {
      rowto[key].checked = !checked;
  });
  const listvitrual = this.listDaiLuong_.filter(c => c.checked === true);
  this.CheckLength = listvitrual.length;
}
CheckedList(checked) {
  const listvitrual = this.listDaiLuong_.filter(c => c.checked === true);
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


// Tìm kiếm
// Phân trang
NextPage() {
  if (this.options.p < this.options.totalpage) {
  this.options.p++;
  this.R1GetListDaiLuong();
  }
}

PrevPage() {
  if (this.options.p > 1) {
  this.options.p--;
  this.R1GetListDaiLuong();
  }
}

// làm mới trang
refreshData() {
  this.options.s = '';
  this.s.SearchRoot(this.options.s);
  this.options.p = 1;
  this.toastr.success('Tải lại trang thành công', 'Thông báo');
}

ngOnDestroy() {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
  if (this.subscription1) {
    this.subscription1.unsubscribe();
  }
  if (this.subscription2) {
    this.subscription2.unsubscribe();
  }
}
}
