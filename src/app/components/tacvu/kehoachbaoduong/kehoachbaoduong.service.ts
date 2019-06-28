import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';
@Injectable({
  providedIn: 'root'
})
export class KehoachbaoduongService {
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
   }

   r1GetListThietBiBaoDuongservice(Nam: number) {
    let url_ = this.BaseURL + '/api/CD_TV_KeHoachBaoDuong/r1getListBaoDuong';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, Nam, options_);
  }
  r2SaveChangeKeHoachBaoDuong(model) {
    let url_ = this.BaseURL + '/api/CD_TV_KeHoachBaoDuong';
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
