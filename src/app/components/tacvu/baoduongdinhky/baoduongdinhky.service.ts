import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';
@Injectable({
  providedIn: 'root'
})
export class BaoduongdinhkyService {
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
  }
  r1ListBaoDuongDinhKy(options) {
    let url_ = this.BaseURL + '/api/CD_TV_BaoDuongDinhKy/r1getlistBaoDuongDinhKy';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, options, options_);
  }
  r2LuuThayDoi(listBDDK) {
    let url_ = this.BaseURL + '/api/CD_TV_BaoDuongDinhKy';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, listBDDK, options_);
  }
  r1DayInsMonth(date: Date): number {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return new Date(year, month, 0).getDate();
  }
}
