import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';
@Injectable({
  providedIn: 'root'
})
export class VattucodienService {
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
  }
  r1GetVTbyID(VatTuID: string) {
    let url_ = this.BaseURL + '/api/CD_DM_VatTu/' + VatTuID;
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
  ContentType: 'application/json; charset=utf-8',
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
  };
  return this.http.get(url_ , options_);
}
  r1ListVatTu(options: object) {
    let url_ = this.BaseURL + '/api/CD_DM_VatTu/r1getDataVatTu';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, options, options_);
  }
  // add
  R2AddVatTu(model_: object) {
    let url_ = this.BaseURL + '/api/CD_DM_VatTu';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, model_, options_);
  }
   // update
   r3updateVatTu(ID: string, model_: object) {
    let url_ = this.BaseURL + '/api/CD_DM_VatTu/' + ID;
      url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
  return this.http.put(url_, model_, options_);
  }
  r4deleteVatTu(Ids: any[]) {
    let url_ = this.BaseURL + '/api/CD_DM_VatTu/r4DelVatTu';
    url_ = url_.replace(/[?&]$/, '');
  const options_: any = {
    ContentType: 'application/json; charset=utf-8',
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };
  return this.http.post(url_, Ids, options_);
  }
  // import excel
R2ImportExcel (files: any) {
  let url_ = this.BaseURL + '/api/CD_DM_VatTu/r2ImportExcel';
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
}
