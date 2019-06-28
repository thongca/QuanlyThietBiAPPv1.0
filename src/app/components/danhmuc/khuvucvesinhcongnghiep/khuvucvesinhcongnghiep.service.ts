import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';
@Injectable({
  providedIn: 'root'
})
export class KhuvucvesinhcongnghiepService {
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
  }

  r1GetKhuVucVSTBbyID(KhuVucVSCNID: string) {
    let url_ = this.BaseURL + '/api/CD_DM_KhuVucVSCN/' + KhuVucVSCNID;
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(url_, options_);
  }

  r1ListKhuVucVS(options: object) {
    let url_ = this.BaseURL + '/api/CD_DM_KhuVucVSCN/r1GetListKhuVucVeSinhCongNghiep';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, options, options_);
  }

  // add
  R2AddKhuVucVS(modelkhuvuc_: object) {
    let url_ = this.BaseURL + '/api/CD_DM_KhuVucVSCN';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, modelkhuvuc_, options_);
  }

  // update
  r3updateKhuVucVS(ID: string, model_: object) {
    let url_ = this.BaseURL + '/api/CD_DM_KhuVucVSCN/' + ID;
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.put(url_, model_, options_);
  }

  r4deleteKhuVucVS(Ids: any[]) {
    let url_ = this.BaseURL + '/api/CD_DM_KhuVucVSCN/r4DelKhuVucVeSinh';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, Ids, options_);
  }
}
