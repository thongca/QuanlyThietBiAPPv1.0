import { Component, OnInit, Injectable } from '@angular/core';
import { PermissionService } from '../../shared/permission.service';
@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
@Injectable()
export class PermissionComponent implements OnInit {

  public listPer:  {
    RightAdd: boolean;
    RightExport: boolean;
    RightUpdate: boolean;
    RightView: boolean;
    RightDel: boolean;
    MenuID: string;
    routerLink: string;
   }[] = [];
  constructor(
    public perservice_: PermissionService,
  ) {
  }

  ngOnInit() {
  }

 listPermission() {
  this.perservice_.getDataPermisson().subscribe(res => {
    if (res['error'] === 1) {
      alert('Lỗi khi đăng nhập');
      return false;
    }
   return this.listPer = res['data'];
  });
  }
  checkPermision(...args) {
    // return true;
    if (!this.listPer) {
      // chua get dc api
        return true;
    }
    console.log(this.listPer);
    for (const item of args) {
        if (this.listPer.indexOf(item) > -1) {
            return true;
        }
    }
    return false;
  }
}
