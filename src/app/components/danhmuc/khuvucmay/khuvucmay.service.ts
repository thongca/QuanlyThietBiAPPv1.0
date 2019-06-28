import { Chitietmay, Khuvucmay } from './khuvucmay';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';

@Injectable({
  providedIn: 'root'
})
export class KhuvucmayService {
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
  }
  r1GetKhuVucbyID(KhuVucID: string) {
    let url_ = this.BaseURL + '/api/CD_DM_KhuVucMay/' + KhuVucID;
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(url_, options_);
  }
  r1GetThongSobyID(ThongSoKTID: string, ThietBiID: string) {
    let url_ = this.BaseURL + '/api/CD_DM_ThietBi/r1GetThongSoByID';
    url_ = url_.replace(/[?&]$/, '');
    const thongSoTB = { ThongSoKTID, ThietBiID };
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, thongSoTB, options_);
  }

  r1ListKhuVuc(options: object) {
    let url_ = this.BaseURL + '/api/CD_DM_KhuVucMay/r1GetListKhuVuc';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, options, options_);
  }

  // list thiết bị select2
  r1Listthietbi() {
    let url_ = this.BaseURL + '/api/CD_DM_KhuVucMay/r1GetListThietBi';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(url_, options_);
  }
  // list nhóm thiết bị
  r1Listdonvitinh() {
    let url_ = this.BaseURL + '/api/CD_DM_ThietBi/r1getdonvitinh';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(url_, options_);
  }
  // add
  R2AddKhuVucChiTietMay(objKhuVucMay: Khuvucmay, arrChiTietMay: Chitietmay[]) {
    const model_ = { objKhuVucMay, arrChiTietMay};
    let url_ = this.BaseURL + '/api/CD_DM_KhuVucMay/r2AddKhuVucChiTietMay';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, model_, options_);
  }
// import excel
R2ImportExcel (files: any) {
  let url_ = this.BaseURL + '/api/CD_DM_KhuVucMay/r2ImportExcel';
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
  const uploadReq = new HttpRequest('POST', url_ , formData, options_ );
  return this.http.request(uploadReq);
}
  // update
  r3updateKhuVuc(ID: string, objKhuVucMay: Khuvucmay, arrChiTietMay: Chitietmay[]) {
    const model_ = {objKhuVucMay, arrChiTietMay};
    let url_ = this.BaseURL + '/api/CD_DM_KhuVucMay/' + ID;
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.put(url_, model_, options_);
  }
  r4deleteKhuVuc(Ids: any[]) {
    let url_ = this.BaseURL + '/api/CD_DM_KhuVucMay/r4DelKhuVuc';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, Ids, options_);
  }

  r4deleteChiTietMay(ID) {
    let url_ = this.BaseURL + '/api/CD_DM_KhuVucMay/' + ID;
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.delete(url_, options_);
  }
}
