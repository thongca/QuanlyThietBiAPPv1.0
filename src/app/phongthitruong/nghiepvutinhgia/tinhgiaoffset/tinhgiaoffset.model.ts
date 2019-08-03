export class Tinhgiaoffset { // 1 dùng ở tinhgiaoffset
    SoLieuID: string;
    KHSoLieu: string;
  TenCot: string;
  Title: string;
  STT: string;
  LoaiIn: string;
  LoaiSoLieu: string;
  CongThuc: string;
  GiaTri: string;
}
export class ObjSanPhamDonHang { // 1 dùng ở tinhgiaoffset
  SanPhamDonHangID: string;
  DonTinhGiaID: string;
  MaSanPham: string;
  TongGiaMax: number;
  TongGiaMin: number;
  TenSanPham: string;
  LoaiInID: number;
  LoaiHopID: number;
  TenLoaiHop: string;
  TenLoaiIn: string;
  CreateDate: Date;
  checked: boolean;
}

