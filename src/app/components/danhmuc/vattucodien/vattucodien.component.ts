import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { Vattucodien } from '../VatTucodien/VatTucodien.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SearchService } from '../../../shared/search.service';
import { UserInfoService } from '../../../shared/user-info.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';
import { VattucodienService } from './vattucodien.service';
import { KetQuaImport } from '../khuvucmay/khuvucmay';

@Component({
  selector: 'app-vattucodien',
  templateUrl: './vattucodien.component.html',
  styleUrls: ['./vattucodien.component.scss']
})
export class VattucodienComponent implements OnInit, OnDestroy {
  options = {s: '', p: 1, pz: 20, totalpage: 0, total: 0, paxpz: 0, mathP: 0};
  // subscript
  private subscription: Subscription;

  // modal
  @ViewChild('largeModal') public largeModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;
  @ViewChild('ImportExModal') public ImportExModal: ModalDirective;
  // tìm kiếm
  todos$ = this.s.$search;
  checkall: boolean;
  // string
  public modeltitle: string;
  CheckLength: number;
  VatTuID: string;
  errormodal: string;
  // obj
  modelVatTu_: Vattucodien;

  // list
  listVatTu_: Vattucodien[];
  listKetQua_: KetQuaImport;
// file
  _files: File;

  constructor(
      private spinnerService: Ng4LoadingSpinnerService ,
     private s: SearchService,
     private _userInfo: UserInfoService,
     private toastr: ToastrService,
     private  permissionsService: NgxPermissionsService,
     private vattuservice_: VattucodienService
  ) {
    this.modelVatTu_ = {
      VatTuID:  null,
      MaVatTu:  '',
      TenVatTu:  '',
      ThuTu:  0,
      NhomVatTuID: '',
      ThietBiID: '',
      IsActive: true,
      checked: false,
      NhaMayID: null
    };
  }

  ngOnInit() {
        // check permission admin
        let Permission = this._userInfo.r1GetobjPermission();
        if (Permission === undefined) {
          Permission = 'NoAdmin';
        }
        this.permissionsService.loadPermissions([`${Permission}`]);

    // tìm kiếm
    this.todos$.subscribe(res => {
      if (res === undefined || res === '') {
        this.options.s = '';
        this.R1GetListVatTu();
      } else {
        this.options.s = res;
        this.R1GetListVatTu();
      }
    });

  }
  SetTotalPage() {
    this.options.totalpage = Math.ceil(this.options.total / this.options.pz);
    this.options.mathP = this.options.pz * this.options.p;
}


// danh sách đơn vị tính
R1GetListVatTu() {
  this.CheckLength = 0;
  this.spinnerService.show();
   this.subscription = this.vattuservice_.r1ListVatTu(this.options).subscribe(res => {
      this.spinnerService.hide();
      if (res['error'] === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.listVatTu_ = res['data'];
      this.options.total = res['total'];
      this.SetTotalPage();
      if (this.options.p > 1) {
          this.options.paxpz = (this.options.p - 1) * this.options.pz;
      } else {
        this.options.paxpz = 0;
      }
});
}
Showmodal(check) {
  if (check === 'add') {
    this.modeltitle = 'Thêm mới nhóm vật tư';
    // tslint:disable-next-line:max-line-length
    this.modelVatTu_ = {
      VatTuID:  null,
      MaVatTu:  null,
      TenVatTu:  '',
      ThuTu:  0,
      NhomVatTuID: '',
      ThietBiID: '',
      IsActive: true,
      checked: false,
      NhaMayID: null
    };
    this.largeModal.show();
  } else {
}
}
// modal
modalUserInGroup(DonViTinhID) {
// this.donviservice_.r1GetnhomTBbyID(DonViTinhID).subscribe(res => {
//   if (res['error'] === 1) {
//     this.toastr.error(res['ms'], 'Thông báo lỗi');
//     return false;
//   }
// });
}

// thêm mới, sửa nhóm vật tư
R2AdDataVatTu(): boolean {
  if (this.modelVatTu_.MaVatTu === '') {
  this.toastr.warning('Vui lòng nhập thông tin vào các trường có dấu (*)', 'Cảnh báo');
    return false;
  }
  if (this.modelVatTu_.VatTuID === '' || this.modelVatTu_.VatTuID === null) {
    this.spinnerService.show();
    this.vattuservice_.R2AddVatTu(this.modelVatTu_).subscribe(res => {
      this.spinnerService.hide();
      if (res !== undefined) {

          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          } else {
            this.toastr.success('Thêm mới nhóm vật tư thành công thành công.', 'Thông báo');
            this.R1GetListVatTu();
            this.largeModal.hide();
          }
      }
    });
  } else {
    this.spinnerService.show();
    this.vattuservice_.r3updateVatTu(this.VatTuID, this.modelVatTu_).subscribe(res => {
      this.spinnerService.hide();
        if (res !== undefined) {
          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          }
          this.toastr.success('Sửa nhóm vật tư thành công!', 'Thông báo');
          this.R1GetListVatTu();
          this.largeModal.hide();
        }
    }, err => {
      if (err.status === 500) {
        this.toastr.success('Mất kết nối đến máy chủ, Vui lòng kiểm tra lại đường dẫn hoặc liên hệ quản trị viên!', 'Thông báo');
        return false;
      }
    });
  }

}
// modal
SelectIDEditModel(VatTuID: string) {
  this.modeltitle = 'Sửa nhóm vật tư';
  this.VatTuID = VatTuID;
 this.subscription =  this.vattuservice_.r1GetVTbyID(VatTuID).subscribe(res => {
    if (res !== undefined) {
      if (res['error']  === 1) {
        this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      } else if (res['error']  === 0) {
        this.modelVatTu_ = res['data'];
        this.largeModal.show();
      }
    }
  });
}

HideModal() {
  this.largeModal.hide();
  this.R1GetListVatTu();
}
// import file excel
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
  this.subscription = this.vattuservice_.R2ImportExcel(this._files).subscribe(res => {
    if (res['body'] !== undefined) {
      this.listKetQua_ = res['body'] as KetQuaImport;
      if (res['body'].error === 1) {
        this.toastr.error( this.listKetQua_.ms, 'Thông báo lỗi');
        this.spinnerService.hide();
        return false;
      } else if (this.listKetQua_.error === 0) {
        this.spinnerService.hide();
        this.ImportExModal.hide();
        this.R1GetListVatTu();
        this.toastr.success('Thêm mới vật tư bằng tệp excel thành công.', 'Thông báo');
      }
    }
  });
}

xacnhanXoa(rowto) {
  if (this.CheckLength > 0) {
    this.r4DelVatTu(rowto);
  }
}
r4DelVatTu(rowto) {
 const arr = [
  ];
  rowto.forEach(function (item) {
    if (item.checked) {
      const obj = {VatTuID: item.VatTuID};
     arr.push(obj);
    }
});
  this.vattuservice_.r4deleteVatTu(arr).subscribe(res => {
    if (res !== undefined) {
      if (res['error'] === 1) {
      this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.warningModal.hide();
      this.toastr.success('Nhóm vật tư ' + res['ms'] + ' đã tồn tại dữ liệu liên quan, Vui lòng kiểm tra lại!', 'Thông báo');
      this.R1GetListVatTu();
    }
  });
}

// checked
toggleAll (rowto, checked) {
  this.CheckLength = 0;
  rowto.forEach(function (value, key) {
      rowto[key].checked = !checked;
  });
  const listvitrual = this.listVatTu_.filter(c => c.checked === true);
  this.CheckLength = listvitrual.length;
}
CheckedList(checked) {
  const listvitrual = this.listVatTu_.filter(c => c.checked === true);
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
  this.R1GetListVatTu();
  }
}

PrevPage() {
  if (this.options.p > 1) {
  this.options.p--;
  this.R1GetListVatTu();
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
}


}
