import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';
import { ChiTietMayCheckListD } from '../../danhmuc/khuvucmay/khuvucmay';

@Injectable({
  providedIn: 'root'
})
export class BangchecklistdinhkyService {
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
   }

     // add
  R2AddCheckListDinhKy(IsTime, ThietbiID: string, arrCheckListD: any) {

    const model_ = {IsTime: IsTime, ThietBiID: ThietbiID , arrCheckListD: arrCheckListD };
    let url_ = this.BaseURL + '/api/CD_TV_CheckListM/r2AddCheckListDinhKy';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, model_, options_);
  }
// trang bang check list định kỳ
r1ListChiTietMay(options: object) {
  let url_ = this.BaseURL + '/api/CD_TV_CheckListM/r1GetListChiTietMay';
  url_ = url_.replace(/[?&]$/, '');
  const options_: any = {
    ContentType: 'application/json; charset=utf-8',
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };
  return this.http.post(url_, options, options_);
}

// monthYear trang checklist
r1ListMonthYear(options: object) {
  let url_ = this.BaseURL + '/api/CD_TV_CheckListM/getmonthYear';
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
