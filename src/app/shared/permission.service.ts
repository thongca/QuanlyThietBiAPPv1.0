import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// url service
import { RootbaseUrlService } from './rootbase-url.service';
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
   }
   getDataPermisson() {
    const options_: any = {
      ContentType: 'application/json',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(this.BaseURL + '/api/ApplicationUser/r1GetPermissionUser', options_);
  }
}
