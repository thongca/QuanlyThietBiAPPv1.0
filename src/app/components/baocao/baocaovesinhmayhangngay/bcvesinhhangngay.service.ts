import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';

@Injectable({
  providedIn: 'root'
})
export class BcvesinhhangngayService {
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
  }
    // list báo cáo vệ sinh công nghiệp hàng ngày
    r1ListBaocaoVesinhHN(options) {
      let url_ = this.BaseURL + '/api/CD_BC_TinhTrangThietBi/r1BaoCaoVSHangNgay';
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
