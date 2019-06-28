import { Subscription } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuDetailService } from '../shared/menu-detail.service';
import { SearchService } from '../shared/search.service';
import { searchRoot } from '../shared/ketqua-tra-ve';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, OnDestroy  {
  private sub: Subscription;
public _listmenuActive: {
  error: number,
  data: [
    {
      IsOrder: number,
      MenuID: string,
      name: string,
      url: string
    }
  ]
};
  constructor(
    private router: Router,
    private _menuService: MenuDetailService,
    private _ssearchService: SearchService,
    private _ssearchRoot: searchRoot,
    private toastr: ToastrService,
    ) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if (localStorage.getItem('token') != null || localStorage.length !== 0) {
      this._ssearchService.SearchRoot('');
       return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
      this.sub = this._menuService.getDataMenuCheckAuth().subscribe(res => {
        if (res !== undefined) {
          this._listmenuActive = res['body'];
          if ( this._listmenuActive.error === 1) {
            this.toastr.error('Bạn đã hết phiên đăng nhập. Vui lòng đăng nhập lại để tiếp tục', 'Thông báo lỗi');
            localStorage.removeItem('listQuyen');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.clear();
            this.router.navigateByUrl('/login');
            this.router.navigate(['/login']);
            return false;
          }
            if (this._listmenuActive.data.filter(x => x.url === route.data.routeLink).length === 0) {
              this.router.navigate(['/trangchu']);
              return false;
            } else {
              this._ssearchService.SearchRoot('');
              return true;
            }
        }
      });
      if (localStorage.getItem('token') != null || localStorage.length !== 0) {
        this._ssearchService.SearchRoot('');
        return true;
       } else {
         this.router.navigate(['/login']);
         return false;
       }
  }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
