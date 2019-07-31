import { Injectable } from '@angular/core';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TieuchitinhgiaService {

  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
  }
  r1GetTCTGbyID(TieuChiID: string) {
    let url_ = this.BaseURL + '/api/TT_DM_TieuChiTinhCong/' + TieuChiID;
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(url_, options_);
  }
  r1ListTT_DM_TCTC(options: object) { /// tieeu chi tinh cong
    let url_ = this.BaseURL + '/api/TT_DM_TieuChiTinhCong/r1TT_DM_TieuChiTinhCong';
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
  R2AddTieuChiTinhGia(model_: object) {
    let url_ = this.BaseURL + '/api/TT_DM_TieuChiTinhCong/r2AddTT_DM_TCTC'; // thêm tiêu chí tính giá
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
  r3updateTCTG(ID: string, model_: object) {
    let url_ = this.BaseURL + '/api/TT_DM_TieuChiTinhCong/' + ID;
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.put(url_, model_, options_);
  }
  r4deleteTCTG(Ids: any[]) {
    let url_ = this.BaseURL + '/api/TT_DM_TieuChiTinhCong/r4DelTieuChiTinhGia';
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
