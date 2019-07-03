import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';
import { Thongsokythuat } from './thietbi';

@Injectable({
  providedIn: 'root'
})
export class ThietbiService {

  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
  }
  r1GetNhaMay() {
    let url_ = this.BaseURL + '/api/CD_DM_ThietBi/r1Cd_DM_NhaMay';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
  ContentType: 'application/json; charset=utf-8',
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
  };
  return this.http.get(url_ , options_);
}
  r1GetThietbibyID(ThietBiID: string) {
    let url_ = this.BaseURL + '/api/CD_DM_ThietBi/' + ThietBiID;
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
  ContentType: 'application/json; charset=utf-8',
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
  };
  return this.http.get(url_ , options_);
}
r1GetThongSobyID(ThongSoKTID: string, ThietBiID: string) {
  let url_ = this.BaseURL + '/api/CD_DM_ThietBi/r1GetThongSoByID';
  url_ = url_.replace(/[?&]$/, '');
  const thongSoTB = {ThongSoKTID, ThietBiID};
  const options_: any = {
ContentType: 'application/json; charset=utf-8',
headers: new HttpHeaders({
  'Authorization': 'Bearer ' + localStorage.getItem('token')
})
};
return this.http.post(url_ , thongSoTB, options_);
}
  r1ListThietBi(options: object) {
    let url_ = this.BaseURL + '/api/CD_DM_ThietBi/r1getlistthietbi';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
  };
  return this.http.post(url_, options , options_);
  }
// list nhóm thiết bị
  r1Listnhomthietbi() {
    let url_ = this.BaseURL + '/api/CD_DM_ThietBi/r1getnhomthietbi';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
  };
  return this.http.get(url_ , options_);
  }
  // list nhóm thiết bị
  r1Listdonvitinh() {
    let url_ = this.BaseURL + '/api/CD_DM_ThietBi/r1getdonvitinh';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
  };
  return this.http.get(url_ , options_);
}
  // add
  R2AddThietBiThongSo(objThietBi: object, arrThongSo: Thongsokythuat[]) {
    const Twoarr_ = {objThietBi, arrThongSo};
    let url_ = this.BaseURL + '/api/CD_DM_ThietBi/r2AddThietBiThongSo';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
return this.http.post(url_, Twoarr_, options_);
  }

  // update
  r3updateThietBi(ID: string, objThietBi: object, arrThongSo: Thongsokythuat[]) {
    const model_ = {objThietBi, arrThongSo};
    let url_ = this.BaseURL + '/api/CD_DM_ThietBi/' + ID;
      url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
  return this.http.put(url_, model_, options_);
  }
  r4deleteThietBi(Ids: any[]) {
    let url_ = this.BaseURL + '/api/CD_DM_ThietBi/r4DelThietBi';
    url_ = url_.replace(/[?&]$/, '');
  const options_: any = {
    ContentType: 'application/json; charset=utf-8',
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };
  return this.http.post(url_, Ids, options_);
  }
  r4deleteChitiet(ID: string) {
    let url_ = this.BaseURL + '/api/CD_DM_ThietBi/' + ID;
    url_ = url_.replace(/[?&]$/, '');
  const options_: any = {
    ContentType: 'application/json; charset=utf-8',
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };
  return this.http.delete(url_, options_);
  }


}
