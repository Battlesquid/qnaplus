import express from "express"
import search from "../../modules/searcher"

const api = express.Router();



api.get("/", (req, res) => {
    res.send("api v1 homepage")
})

api.get("/search", async (req, res) => {
    console.time("query time");

    const searchResult = await search(req);

    console.log(`${searchResult.data.length} results\n
    ${Math.floor(searchResult.data.length / 10)} pages, ${searchResult.data.length % 10} left over
    `)

    res.send(searchResult.data)
    console.timeEnd("query time")
})


export default api;