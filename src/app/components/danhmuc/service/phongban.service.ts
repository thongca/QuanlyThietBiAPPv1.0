import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
// url service
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';

@Injectable({
  providedIn: 'root'
})
export class PhongbanService {
  private BaseURL: string;

  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
    ) {
      this.BaseURL = this.baseUrl_.sbaseURL;
    }

  R1_GetDataPhongBan(options: object) {
        const options_: any = {
      observe: 'response',
      ContentType: 'application/json',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(this.BaseURL + '/api/APP_DM_PhongBan/GetdataPhongBan', options , options_);
  }
  R1_GetDataByID(ID: string) {
        let url_ = this.BaseURL + '/api/APP_DM_PhongBan/' + ID;
        url_ = url_.replace(/[?&]$/, '');
        const options_: any = {
      ContentType: 'application/json',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
      };
    return this.http.get(url_ , options_);
  }
  R2AddPhongBan(model_: object) {
    let url_ = this.BaseURL + '/api/APP_DM_PhongBan/r3AddPhongBan';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      observe: 'response',
      ContentType: 'application/json',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
return this.http.post(`${url_}`, model_, options_);
}
r3updatePhongban(ID: string, model_: object) {
  let url_ = this.BaseURL + '/api/APP_DM_PhongBan/' + ID;
    url_ = url_.replace(/[?&]$/, '');
  const options_: any = {
    ContentType: 'application/json',
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };
return this.http.put(url_, model_, options_);
}
r3deletePhongBan(Arrays: any[]) {
  let url_ = this.BaseURL + '/api/APP_DM_PhongBan/r4deletePhongBan';
  url_ = url_.replace(/[?&]$/, '');
const options_: any = {
  ContentType: 'application/json',
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
};
return this.http.post(url_, Arrays, options_);
}
}
