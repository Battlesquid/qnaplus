import express from "express"
import search from "../../modules/searcher"

const api = express.Router();



api.get("/", (req, res) => {
    res.send("api v1 homepage")
})

api.get("/search", (req, res) => {
    console.time("query time");

    const data = search(req);

    console.log(`${data.length} results\n
    ${Math.floor(data.length / 10)} pages, ${data.length % 10} left over
    `)

    res.send(data)
    console.timeEnd("query time")
})


export default api;