import { Injectable } from '@angular/core';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CachtinhService {

  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
  }
  r1GetDVTbyID(DonViID: string) {
    let url_ = this.BaseURL + '/api/TT_DM_DonViTinh/' + DonViID;
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(url_, options_);
  }
  r1ListTT_DM_DVT(options: object) {
    let url_ = this.BaseURL + '/api/TT_DM_DonViTinh/r1TT_DM_DonViTinh';
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
  R2AddDonViTinh(modeldonvi_: object) {
    let url_ = this.BaseURL + '/api/TT_DM_DonViTinh/r2AddTT_DM_DVT';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, modeldonvi_, options_);
  }

  // update
  r3updateDonViTinh(ID: string, model_: object) {
    let url_ = this.BaseURL + '/api/TT_DM_DonViTinh/' + ID;
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.put(url_, model_, options_);
  }
  r4deleteDonViTinh(Ids: any[]) {
    let url_ = this.BaseURL + '/api/TT_DM_DonViTinh/r4DelDonViTinh';
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
