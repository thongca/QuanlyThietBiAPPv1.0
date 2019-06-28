import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuphongbanService } from './menuphongban.service';
import { ToastrService } from 'ngx-toastr';
import { Menuphongban, RowChangeDocumemt } from './menuphongban';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserInfoService } from '../../../shared/user-info.service';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-menuphongban',
  templateUrl: './menuphongban.component.html',
  styleUrls: ['./menuphongban.component.scss']
})
export class MenuphongbanComponent implements OnInit, OnDestroy {
  // subcript
  private subscription: Subscription;
  private subscription1: Subscription;
  private subscription2: Subscription;
// khai báo danh sách menu
listmenu_: [
  {
    MenuID: string,
    IsChange: boolean,
    Active: boolean
  }
];
errormodal: string;
 objphongban: {};
listphongban_: [
  {
    IsSelect: boolean,
    PhongbanID: string,
    Active: boolean,
    IsChange: boolean
  }
];
 Phongban_ID: string;
// phân trang
 options = {s: '', p: 1, pz: 20, totalpage: 0, total: 0, paxpz: 0, mathP: 0, PhongbanID: ''};
  constructor(
    private spinnerService: Ng4LoadingSpinnerService ,
    private menupbservice_: MenuphongbanService,
    private toastr: ToastrService,
    private _userInfo: UserInfoService,
    private  permissionsService: NgxPermissionsService,
  ) { }

  ngOnInit() {
        // check permission admin
        let Permission = this._userInfo.r1GetobjPermission();
        if (Permission === undefined) {
          Permission = 'NoAdmin';
        }
        this.permissionsService.loadPermissions([`${Permission}`]);

    this.r1ListPhongban();
    this.spinnerService.hide();
  }


  // Danh sách menu theo phòng ban
  r1ListMenuPhongban() {
   this.subscription1 = this.menupbservice_.r1datamenupb(this.Phongban_ID).subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
        }
        this.listmenu_ = res['data'];
      }
    });
  }

  // danh sách phòng ban
  r1ListPhongban() {
    this.subscription2 = this.menupbservice_.r1listPhongBan().subscribe(res => {
      if (res !== undefined) {
        if (res['error'] === 1) {
            this.toastr.error(res['ms'], 'Thông báo lỗi');
            return false;
        }
        this.listphongban_ = res['data'];
        for (let i = 0; i < this.listphongban_.length; i++) {
          this.listphongban_[i].IsSelect = true;
          this.Phongban_ID = this.listphongban_[i].PhongbanID;
          this.objphongban = this.listphongban_[i];
          break;
         }
         if (this.Phongban_ID !== '') {
          this.r1ListMenuPhongban();
         }
      }
    });
  }


  // chọn một phòng ban khác
  SelectRow(row: Menuphongban) {
    this.listphongban_.forEach(element => {
      if (element.PhongbanID === row.PhongbanID) {
        element.IsSelect = true;
      } else {
        element.IsSelect = false;
      }
    });
    this.Phongban_ID = row.PhongbanID;
    this.objphongban = row;
    this.r1ListMenuPhongban();
  }

  // phát hiện thay đổi
  subChange(row: RowChangeDocumemt) {
    this.listmenu_.forEach(x => {
     if (x.MenuID === row.MenuID) {
       x.IsChange = true;
     }
    });
   }
  // luu thay đổi

  LuuPhanmenuchophong() {
    const _listMenu = this.listmenu_.filter(c => c.IsChange === true);
    this.subscription =  this.menupbservice_.r3addPhanmenuPhongBan(_listMenu, this.objphongban).subscribe(res => {
      if (res['error'] === 1) {
       this.toastr.error(res['ms'], 'Thông báo lỗi');
        return false;
      }
      if (res['error'] === 2) {
        this.toastr.warning(res['ms'], 'Cảnh báo');
         return false;
       }
      this.r1ListMenuPhongban();
      this.toastr.success('Lưu phân menu cho nhóm thành công thành công!', 'Thông báo');
    });
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
