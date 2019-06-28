import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';

@Injectable({
  providedIn: 'root'
})
export class BaocaochecklistService {
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
  }

  // báo cáo
r1ListBaocaochecklist(options) {
  let url_ = this.BaseURL + '/api/CD_TV_CheckListM/r1GetListBaoCao';
  url_ = url_.replace(/[?&]$/, '');
  const options_: any = {
    ContentType: 'application/json; charset=utf-8',
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };
  return this.http.post(url_, options, options_);
}
  // báo cáo danh sách máy hỏng nhiều (15 máy)
  r1ListBaocaolistHong(options) {
    let url_ = this.BaseURL + '/api/CD_TV_CheckListM/r1GetListHong';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, options, options_);
  }
  // báo cáo danh sách máy hỏng nhiều (15 máy)
  r1ListBaocaoDetail(options) {
    let url_ = this.BaseURL + '/api/CD_TV_CheckListM/r1GetListBaoCaoDetail';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, options, options_);
  }
  // báo cáo
  r1ListBaocaochecklistMotNam(options) {
    let url_ = this.BaseURL + '/api/CD_TV_CheckListM/r1GetBaoCaoMotNam';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, options, options_);
  }
}
