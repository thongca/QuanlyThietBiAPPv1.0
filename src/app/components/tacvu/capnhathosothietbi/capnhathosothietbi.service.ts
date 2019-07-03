import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';
import { Capnhathosothietbi } from './capnhathosothietbi.model';
@Injectable({
  providedIn: 'root'
})
export class CapnhathosothietbiService {
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
  }

  r1GetListThietBiservice() {
    let url_ = this.BaseURL + '/api/CD_TV_HoSoThietBi/r1getListThietBi';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(url_, options_);
  }
  r1GetListHoSoThietBi(option) {
    let url_ = this.BaseURL + '/api/CD_TV_HoSoThietBi/r1getListHoSoThietBi';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, option, options_);
  }

  r1GetHoSobyID(HoSoThietBiID: string) {
    let url_ = this.BaseURL + '/api/CD_TV_HoSoThietBi/' + HoSoThietBiID;
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
  ContentType: 'application/json; charset=utf-8',
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
  };
  return this.http.get(url_ , options_);
}

// thông số thiết bị
r1GetThongSobyID(options) {
  let url_ = this.BaseURL + '/api/CD_TV_HoSoThietBi/r1getListThongSoThietBi';
  url_ = url_.replace(/[?&]$/, '');
  const options_: any = {
ContentType: 'application/json; charset=utf-8',
headers: new HttpHeaders({
  'Authorization': 'Bearer ' + localStorage.getItem('token')
})
};
return this.http.post(url_ , options, options_);
}
  // update
  r3updateHoSoThietBi(ID: string, model_: object, objThoiGian) {
    const model = {hoSoThietBiDTO: model_, objThoiGian: objThoiGian};
    let url_ = this.BaseURL + '/api/CD_TV_HoSoThietBi/' + ID;
      url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
  return this.http.put(url_, model, options_);
  }
    // add
    R2AddHoSoThietBi(modelpara: Capnhathosothietbi, objThoiGian) {
      const model = {hoSoThietBiDTO: modelpara, objThoiGian: objThoiGian};
      let url_ = this.BaseURL + '/api/CD_TV_HoSoThietBi/r2AddHoSoThietBi';
      url_ = url_.replace(/[?&]$/, '');
      const options_: any = {
        ContentType: 'application/json; charset=utf-8',
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
      };
      return this.http.post(url_, model, options_);
    }
}
