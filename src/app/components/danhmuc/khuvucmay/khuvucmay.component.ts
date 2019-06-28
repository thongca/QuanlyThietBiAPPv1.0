import { KhuvucmayService } from './khuvucmay.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Chitietmay, Khuvucmay, Thietbi, KetQuaImport } from './khuvucmay';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SearchService } from '../../../shared/search.service';
import { UserInfoService } from '../../../shared/user-info.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-khuvucmay',
  templateUrl: './khuvucmay.component.html',
  styleUrls: ['./khuvucmay.component.scss']
})
export class KhuvucmayComponent implements OnInit, OnDestroy {
  // subscript
  private subscription: Subscription;
  private subscription1: Subscription;
  private subscription2: Subscription;
  // options
 options = {s: '', p: 1, pz: 20, totalpage: 0, total: 0, paxpz: 0, mathP: 0, _ThietbiID: ''};
  // model
  litsKhuVucMay_: Khuvucmay[] = [];
  litsChiTietMay_: Chitietmay[] = [];
  modelKhuVucMay_: Khuvucmay;
  modelChiTietMay_: Chitietmay;
  listThietBi_: Thietbi[] = [];
  listKetQua_: KetQuaImport;
    // string
    public modeltitle: string;
    CheckLength: number;
    KhuVucID: string;
    ChiTietID: string;
    checkall: boolean;
    errormodal: string;
   _files: any;
// boolean
IsFlag: boolean;
  // modal
  @ViewChild('largeModal') public largeModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  @ViewChild('warningChiTietModal') public warningChiTietModal: ModalDirective;
  @ViewChild('ImportExModal') public ImportExModal: ModalDirective;

    // tìm kiếm
    todos$ = this.s.$search;

  constructor(
    private s: SearchService,
    private _userInfo: UserInfoService,
    private toastr: ToastrService,
    private  permissionsService: NgxPermissionsService,
    private spinnerService: Ng4LoadingSpinnerService ,
    private khuvucmayservice_: KhuvucmayService
  ) { }

  ngOnInit() {

    this.modelKhuVucMay_ = new Khuvucmay();
    this.modelChiTietMay_ = new Chitietmay();
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
        this.R1GetListTKhuVuc();
      } else {
        this.options.s = res;
        this.R1GetListTKhuVuc();
      }
    });
    this.R1GetListTKhuVuc();
    this.R1GetListThietBi();
  }

  SetTotalPage() {
    this.options.totalpage = Math.ceil(this.options.total / this.options.pz);
    this.options.mathP = this.options.pz * this.options.p;
}
// danh sách thiet bi
R1GetListThietBi() {
  this.spinnerService.show();
   this.subscription1 = this.khuvucmayservice_.r1Listthietbi().subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
     this.listThietBi_ = res['data'];
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
  this.spinnerService.show();
  this.subscription2 = this.khuvucmayservice_.R2ImportExcel(this._files).subscribe(res => {
    if (res['body'] !== undefined) {
      this.listKetQua_ = res['body'] as KetQuaImport;
      if (res['body'].error === 1) {
        this.toastr.error( this.listKetQua_.ms, 'Thông báo lỗi');
        this.spinnerService.hide();
        return false;
      } else if (this.listKetQua_.error === 0) {
        this.spinnerService.hide();
        this.ImportExModal.hide();
        this.R1GetListTKhuVuc();
        this.toastr.success('Thêm mới khu vực máy bằng tệp excel thành công.', 'Thông báo');
      }
    }
  });
}
// danh sách khu vuc máy
R1GetListTKhuVuc() {
  this.spinnerService.show();
   this.subscription = this.khuvucmayservice_.r1ListKhuVuc(this.options).subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.litsKhuVucMay_ = res['data'];
      this.options.total = res['total'];
      this.SetTotalPage();
      if (this.options.p > 1) {
          this.options.paxpz = (this.options.p - 1) * this.options.pz;
      } else {
        this.options.paxpz = 0;
      }
});
}

AddChiTiet() {
  if (this.modelChiTietMay_.TenChiTiet === '') {
    this.toastr.warning('Vui lòng nhập tên thông số kỹ thuật hoặc nhập số liệu tương ứng.', 'Cảnh báo');
    return false;
  }
  this.modelChiTietMay_.TenKhuVuc = this.modelKhuVucMay_.TenKhuVuc;
  this.modelChiTietMay_.IsChange = true;
  this.litsChiTietMay_.push(this.modelChiTietMay_);
  this.modelChiTietMay_ = {
    ChiTietID: '',
      KhuVucID: '',
      TenKhuVuc: '',
      TenChiTiet: '',
      ThuTu: 0,
      IsActive: true,
      IsChange: true,
      IsSelect: false,
  };
}

// add khu vuc may +  chi tiet may
R2AdKhuVucMay(): boolean {
  if (this.modelKhuVucMay_.TenKhuVuc === '' || this.modelKhuVucMay_.ThietBiID === '') {
  this.toastr.warning('Vui lòng nhập thông tin vào các trường có dấu (*)', 'Cảnh báo');
    return false;
  }
  if (this.litsChiTietMay_.length === 0) {
    this.toastr.warning('Vui lòng nhập thông tin danh sách chi tiết máy!', 'Cảnh báo');
    return false;
  }
  if (this.modelKhuVucMay_.KhuVucID === '' || this.modelKhuVucMay_.KhuVucID === null) {
    this.spinnerService.show();
    this.khuvucmayservice_.R2AddKhuVucChiTietMay(this.modelKhuVucMay_, this.litsChiTietMay_).subscribe(res => {
      this.spinnerService.hide();
      if (res !== undefined) {

          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          } else if (res['error'] === 2) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          } else {
            this.toastr.success('Thêm mới thiết bị thành công.', 'Thông báo');
            this.R1GetListTKhuVuc();
            this.largeModal.hide();
          }
      }
    });
  } else {
    this.spinnerService.show();
    this.khuvucmayservice_.r3updateKhuVuc(
      this.KhuVucID,
      this.modelKhuVucMay_,
       this.litsChiTietMay_.filter(x => x.IsChange === true))
       .subscribe(res => {
      this.spinnerService.hide();
        if (res !== undefined) {
          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          }
          if (res['error'] === 2) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          }
          this.toastr.success('Sửa thông tin thiết bị thành công!', 'Thông báo');
          this.R1GetListTKhuVuc();
          this.largeModal.hide();
        }
    });
  }

}
xacnhanXoa(rowto) {
  if (this.CheckLength > 0) {
    this.r4DelKhuVuc(rowto);
  }
}

r4DelKhuVuc(rowto) {
  const arr = [];
   rowto.forEach(function (item) {
     if (item.checked) {
       const obj = {KhuVucID: item.KhuVucID};
      arr.push(obj);
     }
 });
   this.khuvucmayservice_.r4deleteKhuVuc(arr).subscribe(res => {
     if (res !== undefined) {
       if (res['error'] === 1) {
       this.toastr.error(res['ms'], 'Thông báo lỗi');
         return false;
       }
       this.warningModal.hide();
       this.toastr.success('Xóa thành công khu vực máy thành công', 'Thông báo');
       this.CheckLength = 0;
       this.R1GetListTKhuVuc();
     }
   });
 }
 showxacnhan(ChiTietID) {
   this.ChiTietID = ChiTietID;
    this.warningChiTietModal.show();
}
xacnhanXoaChiTiet() {
  this.r4DelChiTiet();
}

 r4DelChiTiet() {
    this.khuvucmayservice_.r4deleteChiTietMay(this.ChiTietID).subscribe(res => {
     if (res !== undefined) {
       if (res['error'] === 1) {
       this.toastr.error(res['ms'], 'Thông báo lỗi');
         return false;
       }
       this.warningChiTietModal.hide();
       this.toastr.success('Xóa thành công chi tiết máy thành công', 'Thông báo');
       this.CheckLength = 0;
       this.R1GetListThietBi();
     }
   });
 }

 // xoa row tren view
 XoaRowChiTiet(index) {
   this.litsChiTietMay_.splice(index, 1);
 }
// show modal

Showmodal(check) {
  if (check === 'add') {
    this.IsFlag = false;
    this.modeltitle = 'Thêm mới khu vực máy';
    this.modelKhuVucMay_ = {
      KhuVucID: '',
      ThietBiID: '',
      TenKhuVuc: '',
      MaThietBi: '',
      ThuTu: '',
      IsActive: false,
      checked: false,
    };
    this.modelChiTietMay_ = {
      ChiTietID: '',
      KhuVucID: '',
      TenKhuVuc: '',
      TenChiTiet: '',
      ThuTu: 0,
      IsActive: true,
      IsChange: false,
      IsSelect: false,
    };
    this.litsChiTietMay_ = [];
    this.largeModal.show();
  } else {
}
}
// change
thietBiChanged(ID) {
this.R1GetListTKhuVuc();
}
// modal
SelectIDEditModel(KhuVucID: string) {
  this.IsFlag = true;
  this.modeltitle = 'Sửa thiết bị';
  this.KhuVucID = KhuVucID;
 this.subscription1 =  this.khuvucmayservice_.r1GetKhuVucbyID(KhuVucID).subscribe(res => {
  if (res !== undefined) {
      if (res['error']  === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
      }
     this.modelKhuVucMay_ = res['datakv'];
     this.litsChiTietMay_ = res['datact'];
    }
    this.largeModal.show();
  });
}
// hidenmodal

HideModal() {
  this.largeModal.hide();
  this.R1GetListTKhuVuc();
}
// select row
selectRowTS (ChiTietID) {
  if (this.litsChiTietMay_ !== undefined) {
   this.litsChiTietMay_.forEach(function(item) {
    if (item.ChiTietID === ChiTietID) {
      item.IsSelect = true;
      item.IsChange = true;
    } else {
      item.IsSelect = false;
    }
   });
  }
}
// làm mới trang
refreshData() {
  this.options.s = '';
  this.s.SearchRoot(this.options.s);
  this.options.p = 1;
  this.toastr.success('Tải lại trang thành công', 'Thông báo');
}
// checked
toggleAll (rowto, checked) {
  this.CheckLength = 0;
  rowto.forEach(function (value, key) {
      rowto[key].checked = !checked;
  });
  const listvitrual = this.litsKhuVucMay_.filter(c => c.checked === true);
  this.CheckLength = listvitrual.length;
}
CheckedList(checked) {
  if (!checked === true) {
    this.CheckLength = 1;
  } else {
    this.CheckLength = 0;
  }

}


// Tìm kiếm
// Phân trang
NextPage() {
  if (this.options.p < this.options.totalpage) {
  this.options.p++;
  this.R1GetListTKhuVuc();
  }
}

PrevPage() {
  if (this.options.p > 1) {
  this.options.p--;
  this.R1GetListTKhuVuc();
  }
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
