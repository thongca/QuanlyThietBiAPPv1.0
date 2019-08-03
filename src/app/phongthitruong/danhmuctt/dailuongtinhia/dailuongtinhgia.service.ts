import { Injectable } from '@angular/core';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DailuongtinhgiaService {

  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
  }
  r1GetDLGbyID(DaiLuongID: number) {
    let url_ = this.BaseURL + '/api/TT_DM_DaiLuong/' + DaiLuongID;
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(url_, options_);
  }
  // danh sách loại in
  r1ListLoaiIn() {
    let url_ = this.BaseURL + '/api/TT_DM_DaiLuong/r1TT_DM_LoaiIn';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(url_, options_);
  }

   // danh sách loại hộp
   r1ListLoaiHop() {
    let url_ = this.BaseURL + '/api/TT_DM_DaiLuong/r1TT_DM_LoaiHop';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(url_, options_);
  }

     // danh sách loại hộp
     r1ListDaiLuong(options) {
      let url_ = this.BaseURL + '/api/TT_DM_DaiLuong/r1TT_DM_DaiLuongDM';
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
  R2AddDaiLuong(modeldonvi_: object) {
    let url_ = this.BaseURL + '/api/TT_DM_DaiLuong/r2addDaiLuong';
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
  r3updateDaiLuong(ID: number, model_: object) {
    let url_ = this.BaseURL + '/api/TT_DM_DaiLuong/' + ID;
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.put(url_, model_, options_);
  }
  r4deleteDaiLuong(Ids: any[]) {
    let url_ = this.BaseURL + '/api/TT_DM_DaiLuong/r4DelDaiLuong';
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
