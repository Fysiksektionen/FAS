
export interface GroupNodeResponse {
    name: string,
    children?: GroupNodeResponse[]
}

export interface TreeItem {
    name?: string,
    attributes?: {
      [key: string]: string,
    };
    children?: TreeItem[],
    _collapsed?: boolean
};
