import { Router } from '@angular/router';
import { Directive, ElementRef, Input, HostListener, OnInit } from '@angular/core';
import { PermissionService } from '../shared/permission.service';
import { PermissionComponent } from '../auth/permission/permission.component';

@Directive({
  selector: '[appBtnPer]'
})
export class BtnPerDirective {
  private urlActive: string;
  private listPermi: any[];
  constructor(
   private ele:  ElementRef,
   private route: Router
  ) {
    this.urlActive =  this.route.url;
    const _listQuyen = localStorage.getItem('listQuyen');
    this.listPermi = JSON.parse(_listQuyen);
  }
   @Input() set appBtnPer(type: string) {
    if (type === 'create') {
      if (this.listPermi !== undefined) {
        const listPerbyUrladd = this.listPermi.filter(x => x.routerLink === this.urlActive && x.RightAdd === true);
        if (listPerbyUrladd.length === 0) {
          this.ele.nativeElement.style.display = 'none';
        }
      }
    } else if (type === 'update') {
      if (this.listPermi !== undefined) {
        const listPerbyUrlUp = this.listPermi.filter(x => x.routerLink === this.urlActive && x.RightUpdate === true);
        if (listPerbyUrlUp.length === 0) {
          this.ele.nativeElement.style.display = 'none';
        }
      }
    } else if (type === 'delete') {
      if (this.listPermi !== undefined) {
        const listPerbyUrlDel = this.listPermi.filter(x => x.routerLink === this.urlActive && x.RightDel === true);
        if (listPerbyUrlDel.length === 0) {
          this.ele.nativeElement.style.display = 'none';
        }
      }
    } else if (type === 'export') {
      if (this.listPermi !== undefined) {
        const listPerbyUrlDel = this.listPermi.filter(x => x.routerLink === this.urlActive && x.RightExport === true);
        if (listPerbyUrlDel.length === 0) {
          this.ele.nativeElement.style.display = 'none';
        }
      }
    }
  }

}
