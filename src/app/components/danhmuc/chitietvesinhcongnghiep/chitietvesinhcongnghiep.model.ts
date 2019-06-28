export class Chitietvesinhcongnghiep {
    KhuVucVSCNID: string;
    TenKhuVucVSCN: string;
    ThuTu: string;
    ThietBiID: string;
    children: Children[];
}

export class Children {
    VeSinhCongNghiepDID: string;
    VeSinhCongNghiepMID: string;
    ChiTietT1: string;
    ChiTietT2: string;
    ChiTietT3: string;
    ChiTietT4: string;
    ChiTietT5: string;
    ThuTu: number;
    UuTienT1: boolean;
    UuTienT2: boolean;
    UuTienT3: boolean;
    UuTienT4: boolean;
    UuTienT5: boolean;
    KhuVucVeSinhCNID: string;
    IsChange: boolean;
    CoTuan5: boolean;
}
