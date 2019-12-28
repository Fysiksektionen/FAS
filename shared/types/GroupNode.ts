
export interface GroupNodeResponse {
    name: String,
    children?: GroupNodeResponse[]
}


// for testing
export const mockFdevGroup : GroupNodeResponse =  {name:"F.dev"}
export const mockGroupResponse : GroupNodeResponse[] = [{name:"Fcom",children:[mockFdevGroup]}, {name:"FKM"}]
