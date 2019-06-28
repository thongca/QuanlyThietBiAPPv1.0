import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
// url service
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';

@Injectable({
  providedIn: 'root'
})
export class PhanquyenService {
  private tokenHeader = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('token')});
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
    ) {
      this.BaseURL = this.baseUrl_.sbaseURL;
     }



// view
  R1_GetDataMenu(GroupRole_ID: string, PhongbanID: string) {
const groupRoles = {GroupRole_ID: GroupRole_ID, PhongbanID: PhongbanID };
    const options_: any = {
  observe: 'response',
  ContentType: 'application/json',
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
};
    return this.http.post(this.BaseURL + '/api/AppSysGroupRole/ListMenu', groupRoles, options_);
  }

// thêm
r1addPhanQuyen(ListMenu: any, ListGRole: {}) {
  const ID = '1';
  const twoArray_ = {ID , ListMenu, ListGRole};
  const options_: any = {
    observe: 'response',
    ContentType: 'application/json',
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };
  return this.http.post(this.BaseURL + '/api/AppCogRoleMenu', twoArray_ , options_);
}
}
