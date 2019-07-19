import { Injectable } from '@angular/core';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NguyennhandungmayService {
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
   }
  r1GetNNbyID(NguyenNhanID: string) {
    let url_ = this.BaseURL + '/api/CD_DM_NguyenNhan/' + NguyenNhanID;
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
  ContentType: 'application/json; charset=utf-8',
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
  };
  return this.http.get(url_ , options_);
}

  r1ListNguyenNhan(options: object) {
    let url_ = this.BaseURL + '/api/CD_DM_NguyenNhan/r1getDataNguyenNhan';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
  };
  return this.http.post(url_, options , options_);
  }

  // add
  R2AddNguyenNhan(modelnguyennhan_: object) {
    let url_ = this.BaseURL + '/api/CD_DM_NguyenNhan/r2AddNguyenNhan';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
return this.http.post(url_, modelnguyennhan_, options_);
  }

  // update
  r3updateNguyenNhan(ID: string, model_: object) {
    let url_ = this.BaseURL + '/api/CD_DM_NguyenNhan/' + ID;
      url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
  return this.http.put(url_, model_, options_);
  }
  r4deleteNguyenNhan(Ids: any[]) {
    let url_ = this.BaseURL + '/api/CD_DM_NguyenNhan/r4DelNguyenNhan';
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
