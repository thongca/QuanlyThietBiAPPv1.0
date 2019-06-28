import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';
import { Children } from './chitietvesinhcongnghiep.model';

@Injectable({
  providedIn: 'root'
})
export class ChitietvesinhcongnghiepService {
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
  }
    // list khu vực vệ sinh công nghiệp
    r1ListKhucVucVeSinhCongNghiep(option: object) {
      let url_ = this.BaseURL + '/api/CD_TV_VeSinhCongNghiepM/r1ListKhuVucVeSinhCongNghiep';
      url_ = url_.replace(/[?&]$/, '');
      const options_: any = {
        ContentType: 'application/json; charset=utf-8',
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
    };
    return this.http.post(url_, option , options_);
    }

      // list vệ sinh công nghiệp
  r1ListVeSinhCongNghiep(options: object) {
    let url_ = this.BaseURL + '/api/CD_TV_VeSinhCongNghiepM/r1GetListVeSinhCongNghiepDanhMuc';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
  };
  return this.http.post(url_, options , options_);
  }
    // Lưu thay đổi bảng vệ sinh công nghiệp
    r2LuuThayDoiVeSinhCongNghiep(IsTime, ThietbiID, arrVSCND: Children[], arrDel) {
      const model_ = {IsTime:  IsTime, ThietbiID: ThietbiID, arrD: arrVSCND, arrDel: arrDel};
      const cURL = '/api/CD_TV_VeSinhCongNghiepM/r3UpdateListDanhGiaVeSinhCongNghiep';
      const options_: any = {
        ContentType: 'application/json; charset=utf-8',
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
      };
  return this.http.post(`${this.BaseURL}${cURL}`, model_, options_);
    }
}
