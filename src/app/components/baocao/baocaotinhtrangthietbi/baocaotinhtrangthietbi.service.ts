import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';
@Injectable({
  providedIn: 'root'
})
export class BaocaotinhtrangthietbiService {
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
  }
  // báo cáo danh sách máy và số thời gian dừng máy
  r1ListBCListTTGDungMay(options) {
    let url_ = this.BaseURL + '/api/CD_BC_TinhTrangThietBi/r1BaoCaoSoGioDungMay';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, options, options_);
  }
   // báo cáo danh sách máy và số thời gian trung bình giữa hai lần dừng máy
   r1ListBCListTTGTB(options) {
    let url_ = this.BaseURL + '/api/CD_BC_TinhTrangThietBi/r1BaoCaoTGTBHaiLanDungMay';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
    };
    return this.http.post(url_, options, options_);
  }
   // báo cáo Pareto
   r1ListPareto(options) {
    let url_ = this.BaseURL + '/api/CD_BC_TinhTrangThietBi/r1BaoCaoPareto';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, options, options_);
  }
}
