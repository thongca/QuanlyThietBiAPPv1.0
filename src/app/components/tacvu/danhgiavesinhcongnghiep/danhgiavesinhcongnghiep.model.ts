export class Children {
        VeSinhCongNghiepDID: string;
        VeSinhCongNghiepMID: string;
        ChiTietT1: string;
        ChiTietT2: string;
        ChiTietT3: string;
        ChiTietT4: string;
        ChiTietT5: string;
        DanhGiaT1: boolean;
        DanhGiaKDT1: boolean;
        DanhGiaT2: boolean;
        DanhGiaKDT2: boolean;
        DanhGiaT3: boolean;
        DanhGiaKDT3: boolean;
        DanhGiaT4: boolean;
        DanhGiaKDT4: boolean;
        DanhGiaT5: boolean;
        DanhGiaKDT5: boolean;
        ThuTu: number;
        UuTienT1: boolean;
        UuTienT2: boolean;
        UuTienT3: boolean;
        UuTienT4: boolean;
        UuTienT5: boolean;
        KhuVucVeSinhCNID: string;
        IsChange: boolean;
}

export class Danhgiavesinhcongnghiep {

    KhuVucVSCNID: string;
    TenKhuVucVSCN: string;
    ThuTu: string;
    ThietBiID: string;
    children: Children[];
}
