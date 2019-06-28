import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// url service
import { RootbaseUrlService } from './rootbase-url.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
private rootURL: string;

  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService,
    private spinnerService: Ng4LoadingSpinnerService
    ) {
      this.rootURL = this.baseUrl_.sbaseURL;
     }

  CheckLogin(User) {
    return this.http.post(this.rootURL + '/api/ApplicationUser/Login', User);
   }
}
