import { Children } from './danhgiavesinhcongnghiep.model';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';
@Injectable({
  providedIn: 'root'
})
export class DanhgiavesinhcongnghiepService {
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
  }

  // list vệ sinh công nghiệp master
  r1ObjM(options: object) {
    let url_ = this.BaseURL + '/api/CD_TV_VeSinhCongNghiepM/r1GetObjM';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
  };
  return this.http.post(url_, options , options_);
  }
  // list vệ sinh công nghiệp
  r1ListVeSinhCongNghiep(options: object) {
    let url_ = this.BaseURL + '/api/CD_TV_VeSinhCongNghiepM/r1GetListVeSinhCongNghiep';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
  };
  return this.http.post(url_, options , options_);
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
  // Lưu thay đổi bảng vệ sinh công nghiệp
  r2LuuThayDoiVeSinhCongNghiep(arrVSCND: Children[]) {
    const cURL = '/api/CD_TV_VeSinhCongNghiepM';
    const options_: any = {
      observe: 'response',
      ContentType: 'application/json',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
return this.http.post(`${this.BaseURL}${cURL}`, arrVSCND, options_);
  }
    // Xác nhận thông tin
    r2XacnhanThongtin(XacNhanPhong: number, TuanMay: number, objU, VeSinhCongNghiepMID: string) {
      const model_ = {Tuan: TuanMay, XacNhanCua: XacNhanPhong, objUser: objU, VeSinhCongNghiepMID: VeSinhCongNghiepMID};
      const cURL = '/api/CD_TV_VeSinhCongNghiepM/r2XacNhanBangVeSinhCongNghiep';
      const options_: any = {
        ContentType: 'application/json',
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
      };
  return this.http.post(`${this.BaseURL}${cURL}`, model_, options_);
    }
  // import excel
  R2ImportExcel(files: any) {
    let url_ = this.BaseURL + '/api/CD_TV_VeSinhCongNghiepM/r2ImportExcel';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    const formData = new FormData();
    // tslint:disable-next-line:max-line-length
    for (const file of files) {
      formData.append(file.name, file);
    }
    const uploadReq = new HttpRequest('POST', url_, formData, options_);
    return this.http.request(uploadReq);
  }
}
