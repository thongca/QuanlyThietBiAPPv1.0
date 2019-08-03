import { Injectable } from '@angular/core';
import { RootbaseUrlService } from '../../../shared/rootbase-url.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TinhgiaoffsetService {
  private BaseURL: string;
  constructor(
    private http: HttpClient,
    private baseUrl_: RootbaseUrlService
  ) {
    this.BaseURL = this.baseUrl_.sbaseURL;
  }

  // lấy bảng tính giá bằng ID sanphamdonhangID
  r1GetBangTGbyID(MaSP, LoaiInID, LoaiHopID, SanPhamDonHangID) {
    const model = { MaSanPham: MaSP, LoaiInID: LoaiInID , LoaiHopID: LoaiHopID, SanPhamDonHangID: SanPhamDonHangID};
    let url_ = this.BaseURL + '/api/TT_DM_DaiLuong/r1GetBangTinhGiaByID';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
  ContentType: 'application/json; charset=utf-8',
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
  };
  return this.http.post(url_ , model, options_);
}
  r1ListCsl(MaSP, LoaiInID, LoaiHopID) {
    const model = { MaSanPham: MaSP, LoaiInID: LoaiInID , LoaiHopID: LoaiHopID};
    let url_ = this.BaseURL + '/api/TT_DM_DaiLuong/r1TT_DM_DaiLuong';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, model, options_);
  }
  r1CheckCode(model) {
    let url_ = this.BaseURL + '/api/TT_DM_DaiLuong/r1CheckMSP';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, model, options_);
  }
  // danh sách san phẩm đã có đơn hàng
  r1ListsanPhamDH(MaSP, LoaiInID, LoaiHopID) {
    const model = { MaSanPham: MaSP, LoaiInID: LoaiInID , LoaiHopID: LoaiHopID};
    let url_ = this.BaseURL + '/api/TT_DM_DaiLuong/r1TT_DH_sanPhamDonHang';
    url_ = url_.replace(/[?&]$/, '');
    const options_: any = {
      ContentType: 'application/json; charset=utf-8',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(url_, model, options_);
  }
    // add
    R2AddBangTinhGia(modelone_, modeltwo, modelthree, sanPham, LuaChon, TongGia) {
      const modeldailuong = modelone_.concat(modeltwo);
    const  model_ = {TieuChiSanPham : modelthree, DaiLuongSoLieu: modeldailuong, SanPham: sanPham, LuaChon: LuaChon, TongGia: TongGia};
      let url_ = this.BaseURL + '/api/TT_DH_DonTinhGia';
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
    r3updateDonViTinh(ID: string, model_: object) {
      let url_ = this.BaseURL + '/api/TT_DM_DonViTinh/' + ID;
      url_ = url_.replace(/[?&]$/, '');
      const options_: any = {
        ContentType: 'application/json; charset=utf-8',
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
      };
      return this.http.put(url_, model_, options_);
    }
}
