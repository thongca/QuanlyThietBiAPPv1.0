import { Injectable } from '@angular/core';
// url service
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class MenuphongbanService {
  // urlroot
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
  }


// view menu
r1datamenupb(PbID: string) {
  const Phongban = {PhongbanID: PbID};
      let url_ = this.BaseURL + '/api/APP_Cog_PhongBanMenu/listmenuphongban';
      url_ = url_.replace(/[?&]$/, '');
          const options_: any = {
        ContentType: 'application/x-www-form-urlencoded; charset=utf-8',
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
      };
      return this.http.post(url_, Phongban, options_);
    }

    // list phong ban
r1listPhongBan() {
      let url_ = this.BaseURL + '/api/APP_Cog_PhongBanMenu/listallphongban';
      url_ = url_.replace(/[?&]$/, '');
          const options_: any = {
        ContentType: 'application/json; charset=utf-8',
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
      };
      return this.http.get(`${url_}`, options_);
    }
r3addPhanmenuPhongBan(arrayMenu: any, objPhongban: {}) {
  let url_ = this.BaseURL + '/api/APP_Cog_PhongBanMenu';
  url_ = url_.replace(/[?&]$/, '');
  const ID = '1';
  const twoArray_ = {ID , arrayMenu, objPhongban};
  const options_: any = {
    ContentType: 'application/json',
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };
  return this.http.post(url_, twoArray_ , options_);
}
}
