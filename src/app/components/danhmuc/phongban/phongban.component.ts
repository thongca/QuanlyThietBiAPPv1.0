import { Ketquatrave } from './../../hethong/ketquatrave';
import { modelPhongBan } from './phongban.model';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxPermissionsService } from 'ngx-permissions';

// import service
import { PhongbanService } from '../service/phongban.service';
import { Subscription } from 'rxjs';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SearchService } from '../../../shared/search.service';
import { UserInfoService } from '../../../shared/user-info.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-phongban',
  templateUrl: './phongban.component.html',
  styleUrls: ['./phongban.component.scss']
})
export class PhongbanComponent implements OnInit, OnDestroy {
// tìm kiếm

todos$ = this.s.$search;
checkall: boolean;
private subscription: Subscription;
private subscription1: Subscription;
   CheckLength: number;
  options = {s: '', p: 1, pz: 20, totalpage: 0, total: 0, paxpz: 0, mathP: 0};
  phongbanmd_: modelPhongBan[] = [];
  modeltitle: any;
  ketqua_: {
    error: number,
    ms: string,
    viewex: string
  };
  modelphongban_: modelPhongBan;
phongban_: {
    PhongbanID: string,
    TenPhongBan: string,
    TenKhongDau: string,
    ThuTu: number,
    IsActive: boolean,
    checked: boolean
}[];

PhongbanID: string;


  errormodal: string;
  @ViewChild('largeModal') public largeModal: ModalDirective;
  @ViewChild('dangerModal') public dangerModal: ModalDirective;
  @ViewChild('warningModal') public warningModal: ModalDirective;


  constructor(
    private spinnerService: Ng4LoadingSpinnerService ,
    private phongbanservice_: PhongbanService,
    private s: SearchService,
     private _userInfo: UserInfoService,
     private toastr: ToastrService,
    private  permissionsService: NgxPermissionsService
  ) {
  }

  ngOnInit() {
        // check permission admin
        let Permission = this._userInfo.r1GetobjPermission();
        if (Permission === undefined) {
          Permission = 'NoAdmin';
        }
        this.permissionsService.loadPermissions([`${Permission}`]);
        this.modelphongban_ = {
          PhongbanID: '',
          TenPhongBan: '',
          TenKhongDau: '',
          ThuTu: 0,
          IsActive: false,
        };
    this.todos$.subscribe(res => {
      if (res === undefined || res === '') {
        this.options.s = '';
        this.r1GetDatPhongBan();
      } else {
        this.options.s = res;
        this.r1GetDatPhongBan();
      }
    });

    this.r1GetDatPhongBan();
  }

  r1GetDatPhongBan() {
  this.subscription1 =  this.phongbanservice_.R1_GetDataPhongBan(this.options).subscribe(res => {
    this.phongban_ = res['body'].data;
    this.options.total = res['body'].total;
    this.SetTotalPage();
    if (this.options.p > 1) {
        this.options.paxpz = (this.options.p - 1) * this.options.pz;
    } else {
      this.options.paxpz = 0;
    }

    });
  }
  SetTotalPage() {
    this.options.totalpage = Math.ceil(this.options.total / this.options.pz);
    this.options.mathP = this.options.pz * this.options.p;
}

R2AddDataPhongBan() {
if (this.modelphongban_.TenPhongBan === '' || this.modelphongban_.TenPhongBan === null ) {
  this.toastr.error('Vui lòng nhập vào các trường có dấu (*) và thử lại.' , 'Thông báo lỗi');
  return false;
}

  if (this.modelphongban_.PhongbanID === '' || this.modelphongban_.PhongbanID === null) {
    this.spinnerService.show();
    this.phongbanservice_.R2AddPhongBan(this.modelphongban_).subscribe(res => {
      if (res['body'] !== undefined) {
        if (res['body'].error === 1) {
          this.errormodal = res['body'].ms;
          this.toastr.error(res['body'].ms , 'Thông báo lỗi');
          return false;
        } else {
          this.spinnerService.hide();
          this.toastr.success('Thêm mới phòng ban thành công!', 'Thông báo');
          this.r1GetDatPhongBan();
          this.largeModal.hide();
        }
      }
    });
  } else {
    this.spinnerService.show();
    this.phongbanservice_.r3updatePhongban(this.PhongbanID, this.modelphongban_).subscribe(res => {
      this.spinnerService.hide();
        if (res !== undefined) {
          if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
          }
          this.toastr.success('Sửa nhóm người dùng thành công!', 'Thông báo');
          this.r1GetDatPhongBan();
          this.largeModal.hide();
        }
    });
  }

}

SelectIDEditModel(PhongbanID) {
  this.modeltitle = 'Sửa phòng ban';
  this.PhongbanID = PhongbanID;
 this.subscription =  this.phongbanservice_.R1_GetDataByID(PhongbanID).subscribe(res => {
    if (res !== undefined) {
      if (res['error']  === 1) {
        this.toastr.error(res['error'], 'Thông báo lỗi');
        return false;
      }
     this.modelphongban_ = res['data'];
    }
  });
  this.largeModal.show();
}
Showmodal(check) {
  if (check === 'add') {
    this.modeltitle = 'Thêm mới phòng ban';
    // tslint:disable-next-line:max-line-length
    this.modelphongban_ = {
      PhongbanID: '',
      TenPhongBan: '',
      TenKhongDau: '',
      ThuTu: 0,
      IsActive: false,
    };
    this.largeModal.show();
  } else {
}
}

xacnhanXoa() {
  if (this.CheckLength > 0) {
    this.r4DelPhongBan();
  }
}
r4DelPhongBan() {
  const listxoa_ = this.phongban_.filter(x => x.checked === true);
  this.phongbanservice_.r3deletePhongBan(listxoa_).subscribe(res => {
    if (res !== undefined) {
      if (res['error'] === 1) {
        this.toastr.error( res['ms'], 'Thông báo lỗi');
        return false;
      }
      this.CheckLength = 0;
      this.warningModal.hide();
      this.r1GetDatPhongBan();
    }
  });
}


HideModal() {
  this.largeModal.hide();
  this.r1GetDatPhongBan();
}

// Phân trang
NextPage() {
  if (this.options.p < this.options.totalpage) {
  this.options.p++;
  this.r1GetDatPhongBan();
  }
}
toggleAll (rowto, checked) {
  this.CheckLength = 0;
  rowto.forEach(function (value, key) {
      rowto[key].checked = !checked;
  });
  const listvitrual = this.phongban_.filter(c => c.checked === true);
  this.CheckLength = listvitrual.length;
}
CheckedList(checked) {
  if (!checked === true) {
    this.CheckLength = 1;
  } else {
    this.CheckLength = 0;
  }

}
PrevPage() {
  if (this.options.p > 1) {
  this.options.p--;
  this.r1GetDatPhongBan();
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
}
}
