import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';

@Injectable({
  providedIn: 'root'
})
export class NhomvattucodienService {
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
  }
  r1GetNVTbyID(NhomVatTuID: string) {
    let url_ = this.BaseURL + '/api/CD_DM_NhomVatTu/' + NhomVatTuID;
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
  ContentType: 'application/json; charset=utf-8',
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
  };
  return this.http.get(url_ , options_);
}
  r1ListNhomVatTu(options: object) {
    let url_ = this.BaseURL + '/api/CD_DM_NhomVatTu/r1getDataNhomVatTu';
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
  R2AddNhomVatTu(model_: object) {
    let url_ = this.BaseURL + '/api/CD_DM_NhomVatTu';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, model_, options_);
  }
   // update
   r3updateNhomVatTu(ID: string, model_: object) {
    let url_ = this.BaseURL + '/api/CD_DM_NhomVatTu/' + ID;
      url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
  return this.http.put(url_, model_, options_);
  }
  r4deleteNhomVatTu(Ids: any[]) {
    let url_ = this.BaseURL + '/api/CD_DM_NhomVatTu/r4DelNhomVatTu';
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
