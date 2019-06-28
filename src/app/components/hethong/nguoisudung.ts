// tslint:disable-next-line:no-empty-interface
export interface Nguoisudung {
    error: '';
    data: [
        {
            UserID: '';
            UserName: '';
            Password: '';
            FullName: '';
            Email: '';
            PhoneNumber: '';
            Address: '';
            IsOrder: 0;
            IsActive: true;
            IsAdmin: false;
            AvaUser: '';
            BirthDay: '';
            SexUser: true;
            GroupRoleID: string;
            GroupRoleName: string;
            LaTruongPhong: boolean;
            BanGiamDoc: boolean;
            TenPhongBan: string;
        }
    ];
    total: 0;
}
export interface DelUser {
    data: [
        {
            UserID: '';
            UserName: '';
            Password: '';
            FullName: '';
            Email: '';
            PhoneNumber: '';
            Address: '';
            IsOrder: 0;
            IsActive: true;
            IsAdmin: false;
            AvaUser: '';
            BirthDay: '';
            SexUser: true;
            GroupRoleID: string;
            GroupRoleName: string;
            LaTruongPhong: boolean;
            BanGiamDoc: boolean;
            TenPhongBan: string;
        }
    ];
}
export interface ResAdd {
        error: number;
        ms: string;
 }
