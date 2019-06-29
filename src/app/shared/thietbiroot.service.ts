import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { RootbaseUrlService } from './rootbase-url.service';

@Injectable({
  providedIn: 'root'
})
export class ThietbirootService {
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService,
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
  }
  r1getThietBiByID(ID: string) {
    const model = {_ThietbiID: ID };
    let url_ = this.BaseURL + '/api/CD_DM_ThietBi/r1RootGetThietBiByID';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
  };
  return this.http.post(url_ , model, options_);
  }
}
