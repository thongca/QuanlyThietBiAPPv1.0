import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { NavData } from './menu';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { UserInfoService } from './user-info.service';
// url service
import { RootbaseUrlService } from './rootbase-url.service';

@Injectable({
  providedIn: 'root'
})
export class MenuDetailService {
public list: {
  error: '',
  data: []
};

private BaseURL: string;
private chilURl = '/api/AppSysMenu';
  constructor(
    private http: HttpClient,
    private _userInfo: UserInfoService,
    private baseUrl_: RootbaseUrlService
    ) {
      this.BaseURL = this.baseUrl_.sbaseURL;
    }

  getDataMenu() {
    const options_: any = {
      observe: 'response',
      ContentType: 'application/json',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(this.BaseURL + this.chilURl, options_);
  }
  getDataMenuCheckAuth() {
    const options_: any = {
      observe: 'response',
      ContentType: 'application/json',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(this.BaseURL + '/api/AppSysMenu/GetmenuAuth', options_);
  }
  getDataHomemenu() {
    const options_: any = {
      ContentType: 'application/json',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(this.BaseURL + '/api/AppSysMenu/MenuHomeThietBi', options_);
  }
}
