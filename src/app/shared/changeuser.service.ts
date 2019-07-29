import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { RootbaseUrlService } from './rootbase-url.service';
@Injectable({
  providedIn: 'root'
})
export class ChangeuserService {
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
  }
    // update
    r3updateMatKhau(model_: object) {
      let url_ = this.BaseURL + 'api/AppSysUser/r3changePassUser';
        url_ = url_.replace(/[?&]$/, '');
      const options_: any = {
        ContentType: 'application/json; charset=utf-8',
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
      };
    return this.http.post(url_, model_, options_);
    }
  }
