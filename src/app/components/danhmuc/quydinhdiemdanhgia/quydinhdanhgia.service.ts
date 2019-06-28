import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';

@Injectable({
  providedIn: 'root'
})
export class QuydinhdanhgiaService {
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
  }
  r1GetQuyDInhDiemTBbyID(QuyDinhDiemID: string) {
    let url_ = this.BaseURL + '/api/CD_DM_QuyDinhDiemVSCN/' + QuyDinhDiemID;
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(url_, options_);
  }

  r1ListQuyDInhDiem(options: object) {
    let url_ = this.BaseURL + '/api/CD_DM_QuyDinhDiemVSCN/r1getListQuyDinhDiem';
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
  R2AddQuyDInhDiem(modelthietbi_: object) {
    let url_ = this.BaseURL + '/api/CD_DM_QuyDinhDiemVSCN/r3AddNhomThietBi';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, modelthietbi_, options_);
  }

  // update
  r3updateQuyDInhDiem(ID: string, model_: object) {
    let url_ = this.BaseURL + '/api/CD_DM_QuyDinhDiemVSCN/' + ID;
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.put(url_, model_, options_);
  }

  r4deleteQuyDInhDiem(Ids: any[]) {
    let url_ = this.BaseURL + '/api/CD_DM_QuyDinhDiemVSCN/r4DelNhomThietBi';
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
