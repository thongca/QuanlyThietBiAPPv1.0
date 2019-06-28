export class KetquaTraVe {
    error: number;
    ms: string;
    viewex: string;
}

// tslint:disable-next-line:class-name
export class resultList {
    error: number;
    data: [
        {
          IsOrder: number,
          MenuID: string,
          MenuName: string,
          MenuRank: number,
          RightAdd: boolean,
          RightDel: boolean,
          RightUpdate: boolean,
          RightView: boolean,
          RightExport: boolean,
          IsChange: boolean,
          PhongbanMenuID: string
        }
    ];
}

// tslint:disable-next-line:class-name
export class searchRoot {
    s: string;
}

