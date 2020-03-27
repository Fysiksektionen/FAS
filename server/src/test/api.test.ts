// import request from "supertest"
// @ts-ignore
import session from 'supertest-session' 
import app from "../app"

/******************
Helper functions used in the tests
*******************/

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

// return an authenticated session
async function getAuthedSession() {
    const sess = session(app)
    // route "/" redirects users to login, in dev/test mode this is done automatically
    await sess.get("/login").expect(302)
    return sess
}

/******************
Tests
*******************/


describe("GET /api/ when NOT authorized", () => {
    let unauthedSession : any
    beforeEach(async () => {
        unauthedSession = session(app)
    })

    it("/api/groups/ should block unauthorized access", async () => {
        const result = await unauthedSession.get("/api/groups")
        expect(result.status).toEqual(401) // 401 Unauthorized
    })

    it("/api/me/ should block unauthorized access", async () => {
        const result = await unauthedSession.get("/api/me")
        expect(result.status).toEqual(401) // 401 Unauthorized
    })
})

describe("GET /api/groups when authorized", () => {
    let authedSession : any
    beforeEach(async () => {
        authedSession = await getAuthedSession()
    })

    it("should return 200 OK", async () => {
        const result = await authedSession.get("/api/groups")
        expect(result.status).toEqual(200)
    })
    it("should return json", async () => { 
        // example test of content. Check out supertest and jest for documentation.
        const result = await authedSession.get("/api/groups")
        expect(result.header['content-type']).toMatch(/json/) // content type, /json/ is a regex.
    })
    it("should return a GroupResponse", async () => {
        // test will fail when you add new properties to the GroupResponseType
        // in order to encourage you to properly test the new features you implemented.
        const result = await authedSession.get("/api/groups")
        expect(result.body).toBeDefined()
        result.body.map(checkGroupResponse)
    })
})


describe("Login and logout", () => {
    it("should be able to logout", async () => {
        const authedSession = await getAuthedSession()
        await authedSession.get("/logout")
        const result = await authedSession.get("/block_unauthorized")
        expect(result.status).toBe(401) // 401 Unauthorized
    })
    it("should be able to login", async () => {
        const sess = session(app)
        await sess.get("/login")
        const result = await sess.get("/block_unauthorized")
        expect(result.status).toBe(200)
    })
})