import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { Nhomnguoidung, DataGRClass } from './nhomnguoidung.model';
// url service
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';
@Injectable({
  providedIn: 'root'
})
export class NhomnguoidungService {
  public list: {
    data:
    [{
      GroupRoleID: '',
      GroupRoleName: '',
      PhongbanID: '',
      IsActive: boolean,
      CreatorID: '',
      IsOrder: number,
      CreateDate: '',
  }],
    error: '',
    total: 0
  };
  private tokenHeader = new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('token')});
  private BaseURL: string;

  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
    ) {
      this.BaseURL = this.baseUrl_.sbaseURL;
     }




  R1_GetDataGroupRole(options: object) {
    const options_: any = {
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
};
    return this.http.post(this.BaseURL + '/api/AppSysGroupRole/ListGroupRole', options , {headers: this.tokenHeader});
  }

  R1_GetDataByID(ID: string) {
    let url_ = this.BaseURL + '/api/AppSysGroupRole/' + ID;
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
  ContentType: 'application/json',
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
};
    return this.http.get(url_ , {headers: this.tokenHeader});
  }
  // lay du lieu user trong mot nhom quyen
  r1GetuserByGroupRoleID(GroupRoleID: string) {
    const groupRoleID = JSON.stringify(GroupRoleID);
    let url_ = this.BaseURL + '/api/AppSysGroupRole/listuserbyID';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
};
    return this.http.post(url_, groupRoleID , options_);
  }
  R2AddNhomNguoiDung(model_: object) {
    const cURL = '/api/AppSysGroupRole/r3addNhomrole';
    const options_: any = {
      observe: 'response',
      ContentType: 'application/json',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
return this.http.post(`${this.BaseURL}${cURL}`, model_, options_);
}
r3updateNhomNguoiDung(ID: string, model_: object) {
  let url_ = this.BaseURL + '/api/AppSysGroupRole/' + ID;
    url_ = url_.replace(/[?&]$/, '');
  const options_: any = {
    ContentType: 'application/json',
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };
return this.http.put(url_, model_, options_);
}



r3deleteNhomNguoiDung(Arrays: []) {
  let url_ = this.BaseURL + '/api/AppSysGroupRole/DelNhomNguoiDung';
    url_ = url_.replace(/[?&]$/, '');

    // const content_ = JSON.stringify(Arrays);
    // console.log(content_);

  const options_: any = {
    observe: 'response',
    ContentType: 'application/json',
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };
  return this.http.post(url_, Arrays, options_);
}
}
