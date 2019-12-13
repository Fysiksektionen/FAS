import request from "supertest"
import app from "../src/app"

describe("GET /api", () => {
    it("should return 200 OK", () => {
        return request(app).get("/api")
            .expect(200)
    })
    it("should return correct message", () => { // example test of content. Check out supertest and jest for documentation.
        return request(app).get("/api")
            .expect("Content-Type", /json/) // /json/ is a regex.
            .expect(200, {"message":"Hello fdev!"})
    })
})