import request from "supertest"
import app from "../app"


// iterate recursively through mock response to verify it matches the GroupNodeResponse type.
function checkGroupResponse(groupNode:any){
    // should contain a string name 
    expect(groupNode).toMatchObject({name: expect.any(String)})
    // change these when you edit the GroupNodeResponse type.
    const expectedKeysSuperset = ['name', 'children']
    // expect actual keys to be subset of the expected keys
    expect(expectedKeysSuperset).toEqual(expect.arrayContaining(Object.keys(groupNode)))
    if (groupNode.children){
        expect(groupNode.children).toEqual(expect.any(Array))
        groupNode.children.map(checkGroupResponse)
    }
    return true
}


describe("GET /api/groups", () => {
    it("should return 200 OK", async () => {
        const result = await request(app).get("/api/groups")
        expect(result.status).toEqual(200)
    })
    it("should return json", async () => { 
        // example test of content. Check out supertest and jest for documentation.
        const result = await request(app).get("/api/groups")
        expect(result.header['content-type']).toMatch(/json/) // content type, /json/ is a regex.
    })
    it("should return a GroupResponse", async () => {
        // test will fail when you add new properties to the GroupResponseType
        // in order to encourage you to properly test the new features you implemented.
        const result = await request(app).get("/api/groups")
        result.body.map(checkGroupResponse)
    })
})