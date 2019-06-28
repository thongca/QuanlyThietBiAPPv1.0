export class Khuvucmay {
    KhuVucID: string;
    ThietBiID: string;
    TenKhuVuc: string;
    MaThietBi: string;
    ThuTu: string;
    IsActive: boolean;
    checked: boolean;
}

export class Chitietmay {
    ChiTietID: string;
    KhuVucID: string;
    TenKhuVuc: string;
    TenChiTiet: string;
    ThuTu: number;
    IsActive: boolean;
    IsChange: boolean;
    IsSelect: boolean;
}

export class Thietbi {
   ThietBiID: string;
   TenThietBi: string;
   NgayLapHSo: Date;
}

export class KetQuaImport {
    ms: string;
    error: number;
 }

 export class ChiTietMayCheckListD {
    KhuVucID: string;
    ThietBiID: string;
    ChiTietID: string;
    TenKhuVuc: string;
    children: {
        CheckListDID: string;
        KhuVucID: string;
        ChiTietID: string;
        Good: boolean;
        NeedRepair: boolean;
        Note: string;
        IsChange: boolean;
        DateUpdateEndD: Date;
    }[];
}
export class KhuVucPara {
    KhuVucID: string;
}

export class LMonth {
    Month: number;
    Year: number;
}
export class Thang {
    TenThang: string;
    IsMonth: number;
    IsYear: number;
}
