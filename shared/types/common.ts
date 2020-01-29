
export interface stdDict {
    [key: string]: any;
};

type basic = undefined | null | number | string | bigint | symbol;

export interface basicDict {
    [key: string]: basic | basicDict | (basic | basicDict)[];
};